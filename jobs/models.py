import uuid
from django.db import models

from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

from taggit.managers import TaggableManager


def jwt_get_secret_key(user_model):
    return user_model.jwt_secret

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
# Employer model
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
    published_date = models.DateTimeField(blank=True, null=True)
   
    def publish(self):
        self.published_date = timezone.now()
        self.save()

    class Meta:
        ordering = ('published_date',)

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)


class JobPost(models.Model):
    company_name = models.ForeignKey('jobs.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    company_image = models.ImageField(null=True, blank=True, upload_to='post_image')
    job_location = models.CharField(max_length=30, blank=True)
    requirements = models.CharField(max_length=400, blank=True)
    min_salary = models.IntegerField(null=True, blank=True)
    max_salary = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField()
    tags = TaggableManager()
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)

     
    class Meta:
        ordering = ('published_date',)

    def __str__(self):
        return self.title

    def publish(self):
        self.published_date = timezone.now()
        self.save()


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
    published_date = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ('published_date',)

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)

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