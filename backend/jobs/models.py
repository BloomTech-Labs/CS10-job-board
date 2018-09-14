from django.db import models
from django.utils import timezone

from taggit.managers import TaggableManager


# Employer model
class Employer(models.Model):
    company_name = models.ForeignKey('auth.User', on_delete=models.CASCADE)
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

     
    class Meta:
        ordering = ('published_date',)

    def __str__(self):
        return self.title

    def publish(self):
        self.published_date = timezone.now()
        self.save()


class Employee(models.Model):
    company_name = models.ForeignKey('auth.User', on_delete=models.CASCADE)
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