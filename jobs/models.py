import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models.signals import post_save
from taggit.managers import TaggableManager
from datetime import datetime
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY


class UserManager(BaseUserManager):

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given email and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        is_employee = models.BooleanField(default=False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

        # add username, first_name, last_name, email, password


class User(AbstractBaseUser, PermissionsMixin):
    is_employer = models.BooleanField(default=False)
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
    password = models.CharField(max_length=100, default="", null=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    company_name = models.CharField(max_length=200, blank=True)
    company_logo = models.FileField(upload_to='company_logo/%Y/%m/%d/', blank=True, null=True)
    company_summary = models.CharField(max_length=6000, blank=True)
    application_inbox = models.EmailField(blank=True, default='')
    first_name = models.CharField(max_length=200, blank=True)
    last_name = models.CharField(max_length=200, blank=True)
    profile_photo = models.ImageField(upload_to='profile_photo/%Y/%m/%d/', blank=True, null=True)
    created_date = models.DateTimeField(default=timezone.now, editable=False)
    jwt_secret = models.UUIDField(default=uuid.uuid4)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = []

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return self.email


class JobPost(models.Model):
    company = models.ForeignKey('jobs.User', on_delete=models.CASCADE, null=True)
    company_name = models.CharField(max_length=200, blank=True)
    title = models.CharField(max_length=200, blank=True)
    company_logo = models.ImageField(upload_to='job_post/company_logo/%Y/%m/%d/', blank=True, null=True)
    description = models.CharField(max_length=12000, blank=True)
    job_location = models.CharField(max_length=200, blank=True)
    requirements = models.CharField(max_length=12000, null=True, blank=True)
    min_salary = models.IntegerField(null=True, blank=True)
    max_salary = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=False)
    tags = TaggableManager(verbose_name="Tags", help_text="Enter tags separated by commas", blank=True)
    created_date = models.DateTimeField(default=timezone.now, editable=False)
    published_date = models.DateTimeField(blank=True, null=True)
    post_expiration = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-post_expiration']

    # @published_date.setter
    def publish(self):
        self.published_date = timezone.now()
        # self.save()

    # @post_expiration.setter
    def set_expiration(self):
        self.post_expiration = timezone.now() + timezone.timedelta(days=30)


# Django post_save signal listener to decrement job_credit on UserMembership
def post_job_save_update_usermembership(sender, instance, created, *args, **kwargs):
    # print('post_save', instance.is_active, instance.post_expiration)
    # If Job Post is new & published
    if instance.is_active is True and created is True:
        user_membership = UserMembership.objects.get(user=instance.company)
        user_membership.job_credit -= 1
        user_membership.save()
        instance.publish()
        instance.set_expiration()
        instance.save()
    # If Job Post is being published for the first time
    elif instance.is_active is True and created is False and instance.post_expiration is None:
        user_membership = UserMembership.objects.get(user=instance.company)
        user_membership.job_credit -= 1
        user_membership.save()
        instance.publish()
        instance.set_expiration()
        instance.save()
    

post_save.connect(post_job_save_update_usermembership, sender=JobPost)


# Defines subscription type and stripe_id, if any.
class UserMembership(models.Model):
    # id of UserMemberhship is user_id because primary_key=True for the OneToOneField
    user = models.OneToOneField('jobs.User', on_delete=models.CASCADE, primary_key=True)
    stripe_id = models.CharField(max_length=40)
    SUBSCRIPTION_CHOICES = (('F', 'Free'), ('plan_DoNu8JmqFRMrze', 'Unlimited'))
    subscription = models.CharField(choices=SUBSCRIPTION_CHOICES, default='F', max_length=30)
    job_credit = models.IntegerField(default=0, blank=True)

    def __str__(self):
        return self.user.email


# Defines a payment object created when a purchase is made.
# Includes post_save actions to create Stripe Customer ID if it does not exist.
class UserPayment(models.Model):
    user = models.ForeignKey('jobs.User', on_delete=models.CASCADE)
    stripe_token = models.CharField(max_length=128, blank=True)
    PAYMENT_CHOICES = (
        ('sku_DoNhM1EGgKGLeg', '1 Post'),
        ('sku_DoNp2frdbkieqn', '12 Posts'),
        ('plan_DoNu8JmqFRMrze', 'Unlimited Posts')
    )
    purchased = models.CharField(choices=PAYMENT_CHOICES, max_length=30)
    quantity = models.IntegerField(default=1)
    created_date = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return self.user.email


########### Stripe API ###########

# Creates a Membership instance for User after Payment token is saved, if none exists
# Uses the post_save Django signal to run when a UserPayment object is creatd from /pay API
def post_pay_usermembership_create(sender, instance, *args, **kwargs):
    # get_or_create returns two variables in a tuple, the second being a boolean about creation status
    user_membership, created = UserMembership.objects.get_or_create(user=instance.user)
    if created:
        new_customer = stripe.Customer.create(
            email=instance.user,
            source=instance.stripe_token
        )
        user_membership.stripe_id = new_customer['id']
        user_membership.save()

    # If subscription purchase, assign plan to customer with Stripe Subscription API
    if instance.purchased is 'plan_DoNu8JmqFRMrze':
        stripe.Subscription.create(
            customer=user_membership.stripe_id,
            items=[
                {
                    "plan": "plan_DoNu8JmqFRMrze"
                }
            ]
        )

        # Save subscription status on UserMembership
        user_membership.subscription = 'plan_DoNu8JmqFRMrze'
        user_membership.save()

    # Else purchase a job post product with Stripe Order API
    else:
        new_order = stripe.Order.create(
            currency='usd',
            customer=user_membership.stripe_id,
            items=[
                {
                    "type": "sku",
                    "parent": f'{instance.purchased}',
                    "quantity": f'{instance.quantity}'
                }
            ]
        )
        # Pay created order
        new_order.pay(
            customer=user_membership.stripe_id
        )

        # Set quantity on userMembership model
            # 12 Pack
        if instance.purchased is 'sku_DoNp2frdbkieqn':
            user_membership.job_credit += 12
        else: 
            # 1 Job Post (max is 11)
            user_membership.job_credit += instance.quantity
        user_membership.save()


# Django post_save signal
post_save.connect(post_pay_usermembership_create, sender=UserPayment)






    # def post_save_usermembership_create(sender, instance, created, *args, **kwargs):
    #     if created:
    #         UserMembership.objects.get_or_create(user=instance)

    #     user_membership, created = UserMembership.objects.get_or_create(user=instance)
    #     # if the user has not signed up, create stripe id for them
    #     if user_membership.stripe_id is None or user_membership.stripe_id == '':
    #         new_customer_id = stripe.Customer.create(email=instance.email)
    #         user_membership.stripe_id = new_customer_id['id']
    #         # set_product_id = stripe.
    #         user_membership.save()
    
    # post_save.connect(post_save_usermembership_create, sender=settings.AUTH_USER_MODEL)


# class Subscription(models.Model):
# 	user_membership = models.ForeignKey(UserMembership, on_delete=models.CASCADE)
# 	stripe_subscription_id = models.CharField(max_length=40)
# 	active = models.BooleanField(default=True)

# 	def __str__(self):
# 		return self.user_membership.user.email

# 	@property
# 	def get_created_date(self):
# 		subscription = stripe.Subscription.retrieve(self.stripe_subscription_id)
# 		return datetime.fromtimestamp(subscription.created)

# 	@property
# 	def get_next_billing_date(self):
# 		subscription = stripe.Subscription.retrieve(self.stripe_subscription_id)
# 		return datetime.fromtimestamp(subscription.current_period_end)