from mixer.backend.django import mixer
import pytest


@pytest.mark.django_db
class ModelsTest:
    def test(self):
        jobpost = mixer.blend('jobs.JobPost', quantity=1)
        assert jobpost.publish == True
