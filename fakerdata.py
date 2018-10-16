import factory
from jobs import models
from random import randint, choice


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.User

    email = 'email'
    password = 'password'


class JobPostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.JobPost

    company = 'company' 
    company_name = 'company_name' 
    title = 'title' 
    company_logo = 'company_logo' 
    description = 'description' 
    job_location = 'job_location' 
    requirements = 'requirements' 
    min_salary = 'min_salary' 
    max_salary = 'max_salary'
    is_active = 'is_active' 
    tags = 'tags' 
    created_date = 'created_date' 
    published_date = 'published_date'