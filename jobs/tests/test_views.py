from django.test import TestCase, Client

class TestViews(TestCase):
    # Set up a client to test with
    def test_set_up(self):
        self.client = Client()

    