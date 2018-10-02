from mixer.backend.django import mixer
import pytest


@pytest.mark.django_db
class ModelsTest:
    def publish_class(self):
        jobpost = mixer.blend('jobs.JobPost', quantity=1)
        assert jobpost.publish == True
        
    def str_title(self):
        jobpost = mixer.blend('jobs.JobPost', quantity=1)
        assert jobpost._str_ == self.title
