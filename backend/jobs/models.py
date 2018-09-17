
from django.contrib import admin
from django.db import models

from django.utils import timezone
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager

from taggit.managers import TaggableManager


import uuid


def jwt_get_secret_key(user_model):
    return user_model.jwt_secret

class UserManager(BaseUserManager):

    use_in_migrations = True 

    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser):
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
    email = models.EmailField(unique=True)
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
    salary = models.IntegerField()
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