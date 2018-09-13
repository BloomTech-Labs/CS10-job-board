from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from uuid import uuid4

from taggit.managers import TaggableManager 


# Employer model
class Employer(models.Model):
    company_name = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_image', blank=True)
    email = models.CharField(max_length=35)
    firstName = models.CharField(max_length=30)
    lastName = models.CharField(max_length=30)
    summary = models.TextField()
    applicationInbox = models.CharField(max_length=35)
    password = models.CharField(max_length=100, default="", null=False)
    isEmployee = models.BooleanField(default=False)
    isActive = models.BooleanField()
    published_date = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()
    
    class Meta:
        ordering = ('published_date',)

    def __str__(self):
        return self.summary 


class JobPost(models.Model):
    #id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    company_name = models.ForeignKey('auth.User', on_delete=models.CASCADE)
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
    
    
    def publish(self):
        self.published_date = timezone.now()
        self.save()
    
    class Meta:
        ordering = ('published_date',)

    def __str__(self):
        return self.title 



class Employee(models.Model):
    company_name = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_image', blank=True)
    email = models.CharField(max_length=35)
    firstName = models.CharField(max_length=20)
    lastName = models.CharField(max_length=20)
    description = models.TextField()
    appsInbox = models.CharField(max_length=35)
    password = models.CharField(max_length=100, default="", null=False)
    isEmployer = models.BooleanField(default=False)
    published_date = models.DateTimeField(blank=True, null=True)
    
    def publish(self):
        self.published_date = timezone.now()
        self.save()
    
    class Meta:
        ordering = ('published_date',)

    def __str__(self):
        return self.lastname