from django.test import TestCase
from django.utils import timezone
from jobs.models import JobPost


class JobPostTest(TestCase):

    # set up data for job post
    @classmethod
    def setUpTestData(cls):
        JobPost.objects.create(title='first job')
        JobPost.objects.create(description='a description here')
        JobPost.objects.create(job_location='Location, State')
        JobPost.objects.create(requirements='another description here')
        JobPost.objects.create(min_salary=100000)
        JobPost.objects.create(max_salary=200000)
        JobPost.objects.create(is_active=True)
        JobPost.objects.create(tags='a tag here')
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

    def test_job_location_content(self):
        jobPost = JobPost.objects.get(id=3)
        expected_object_name = f'{jobPost.job_location}'
        self.assertEquals(expected_object_name, 'Location, State')

    def test_requirements_content(self):
        jobPost = JobPost.objects.get(id=4)
        expected_object_name = f'{jobPost.requirements}'
        self.assertEquals(expected_object_name, 'Location, State')

    def test_min_salary_content(self):
        jobPost = JobPost.objects.get(id=4)
        expected_object_name = f'{jobPost.min_salary}'
        self.assertEquals(expected_object_name, 100000)

    def test_max_salary_content(self):
        jobPost = JobPost.objects.get(id=4)
        expected_object_name = f'{jobPost.max_salary}'
        self.assertEquals(expected_object_name, 200000)

    def test_is_active_content(self):
        jobPost = JobPost.objects.get(id=4)
        expected_object_name = f'{jobPost.is_active}'
        self.assertEquals(expected_object_name, True)

    def test_tags_content(self):
        jobPost = JobPost.objects.get(id=4)
        expected_object_name = f'{jobPost.tags}'
        self.assertEquals(expected_object_name, 'a tag here')

    def test_created_date_content(self):
        jobPost = JobPost.objects.get(id=4)
        expected_object_name = f'{jobPost.created_date}'
        self.assertEquals(expected_object_name, timezone.now())

    def test_published_date_content(self):
        jobPost = JobPost.objects.get(id=4)
        expected_object_name = f'{jobPost.published_date}'
        self.assertEquals(expected_object_name, timezone.now())



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
