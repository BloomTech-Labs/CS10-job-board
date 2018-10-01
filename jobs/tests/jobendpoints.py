from django.test import TestCase
from jobs.models import JobPost

# Create your tests here.


class JobPostTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        JobPost.objects.create(title='first job')
        JobPost.objects.create(description='a description here')

    def test_title_content(self):
        jobPost = JobPost.objects.get(id=1)
        expected_object_name = f'{jobPost.title}'
        self.assertEquals(expected_object_name, 'first JobPost')

    def test_description_content(self):
        jobPost = JobPost.objects.get(id=2)
        expected_object_name = f'{jobPost.description}'
        self.assertEquals(expected_object_name, 'a description here')
