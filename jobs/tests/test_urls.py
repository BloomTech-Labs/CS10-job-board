from django.urls import resolve, Resolver404

class TestJobBoardUrls:
    def test_root_url(self):
        try:
            path = resolve('api/register')
        except Resolver404:
            'Not found'