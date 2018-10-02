from django.test import TestCase
from django.utils import timezone
from jobs.models import JobPost


class JobPostTest(TestCase):

    @classmethod
    # set up data for job post
    def setUpTestData(cls):
        JobPost.objects.create(title='first job')
        JobPost.objects.create(description='a description here')
        JobPost.objects.create(job_location='Location, State')
        JobPost.objects.create(requirements='another description here')
        JobPost.objects.create(min_salary=100000)
        JobPost.objects.create(max_salary=200000)
        JobPost.objects.create(is_active=True)
        JobPost.objects.create(tags='a description here')
        JobPost.objects.create(created_date=timezone.now())
        JobPost.objects.create(published_date=timezone.now())

    def test_title_content(self):
        jobPost = JobPost.objects.get(id=1)
        expected_object_name = f'{jobPost.title}'
        self.assertEquals(expected_object_name, 'first JobPost')

    def test_description_content(self):
        jobPost = JobPost.objects.get(id=2)
        expected_object_name = f'{jobPost.description}'
        self.assertEquals(expected_object_name, 'a description here')


"""
guide for test cases

title = models.CharField(max_length=200)
description = models.TextField()
job_location = models.CharField(max_length=30, blank=True)
requirements = models.TextField()
min_salary = models.IntegerField(null=True, blank=True)
max_salary = models.IntegerField(null=True, blank=True)
is_active = models.BooleanField(default=False)
tags = TaggableManager(
    verbose_name="Tags", help_text="Enter tags separated by commas", blank=True)
created_date = models.DateTimeField(default=timezone.now)
published_date = models.DateTimeField(blank=True, null=True)
"""
