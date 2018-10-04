from mixer.backend.django import mixer
from django.utils import timezone
from jobs.models import JobPost
import pytest

@pytest.mark.django_db
class TestJobPost:
    def test_jobpost_model(self):
        self.company_name = 'Google MERN'
        self.title = 'Software Engineer'
        self.description = 'Program in MERN stack'
        self.job_location = 'Las Vegas'
        self.requirements = 'Must work in MERN stack for at least a year'
        self.min_salary = 60000
        self.max_salary = 80000
        self.is_active = True
        self.tags = 'javascript, mongodb, sql, express.js'
        self.created_date = timezone.now()
        self.published_date = timezone.now()

        self.test_jobpost = JobPost.objects.create(
            title = self.title,
            description = self.description,
            job_location = self.job_location,
            requirements = self.requirements,
            min_salary = self.min_salary,
            max_salary = self.max_salary,
            is_active = self.is_active,
            tags = self.tags,
            created_date = self.created_date,
            published_date = self.published_date,
        )

        def test_publish_jobpost(self):
            assert isinstance(self.test_jobpost, JobPost)

"""
guide for test cases
company_name = models.ForeignKey('jobs.User', on_delete=models.CASCADE)
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
