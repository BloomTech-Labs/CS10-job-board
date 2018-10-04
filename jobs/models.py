import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models.signals import post_save
from taggit.managers import TaggableManager
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
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    jwt_secret = models.UUIDField(default=uuid.uuid4)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email


class Employer(models.Model):
    company_name = models.ForeignKey('jobs.User', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_image', blank=True)
    email = models.EmailField()
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    summary = models.TextField()
    applications_inbox = models.EmailField(blank=True, default='')
    password = models.CharField(max_length=100, default="", null=False)
    is_employee = models.BooleanField(default=False)
    is_active = models.BooleanField()
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)


class Employee(models.Model):
    company_name = models.ForeignKey('jobs.User', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_image', blank=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    description = models.TextField()
    apps_inbox = models.CharField(max_length=35)
    password = models.CharField(max_length=100, default="", null=False)
    is_employer = models.BooleanField(default=False)
    created_date = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)


class JobPost(models.Model):
    company_name = models.ForeignKey('jobs.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    job_location = models.CharField(max_length=30, blank=True)
    requirements = models.TextField(null=True)
    min_salary = models.IntegerField(null=True, blank=True)
    max_salary = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=False)
    tags = TaggableManager(verbose_name="Tags", help_text="Enter tags separated by commas", blank=True)
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)
     
    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title

    @property
    def publish(self):
        self.published_date = timezone.now()
        self.save()


#3 types of memberships
MEMBERSHIP_CHOICES = (('Free', 'default'),('Individual Post', 'ind'), ('12pack', '12'), ('Unlimited', 'unlimited'))

#create a class for the various types of memberships
class Membership(models.Model):
    slug = models.SlugField()
    membership_type = models.CharField(choices=MEMBERSHIP_CHOICES, default='Free', max_length=30)
    price = models.IntegerField(default=15)
    stripe_plan_id = models.CharField(max_length=40)

    def __str__(self):
        return self.membership_type

#create a class for defining the type of member a user is
class UserMembership(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=40)
    membership = models.ForeignKey(Membership, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.user.email


def post_save_usermembership_create(sender, instance, created, *args, **kwargs):
    if created:
        UserMembership.objects.get_or_create(user=instance)

    user_membership, created = UserMembership.objects.get_or_create(user=instance)
    #if the user has not signed up, create stripe id for them
    if user_membership.stripe_customer_id is None or user_membership.stripe_customer_id == '':
        new_customer_id = stripe.Customer.create(email=instance.email)
        user_membership.stripe_customer_id = new_customer_id['id']
        user_membership.save()
    
post_save.connect(post_save_usermembership_create, sender=settings.AUTH_USER_MODEL)

class Subscription(models.Model):
    user_membership = models.ForeignKey(UserMembership, on_delete=models.CASCADE)
    stripe_subscription_id = models.CharField(max_length=40)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.user_membership.user.email