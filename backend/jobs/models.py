from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_employer = models.BooleanField(default=True)

class Employer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, related_name='employer_profile')
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    company_name = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    summary = models.TextField()


class JobPost(models.Model):
    company_name = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.FileField(upload_to='post_image', blank=True)
    salary = models.IntegerField()
    is_active = models.BooleanField()
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title 