
from mixer.backend.django import mixer
import pytest


@pytest.mark.django_db
class ModelsTest:
    # test cases fr JobPost model
    def publish_class(self):
        jobpost = mixer.blend('jobs.JobPost', quantity=1)
        assert jobpost.publish == True
        
    def str_title(self):
        jobpost = mixer.blend('jobs.JobPost', quantity=1)
        assert jobpost._str_ == True
