from django.urls import resolve, Resolver404

class TestJobBoardUrls:
    def test_register_url(self):
        try:
            path = resolve('api/register')
        except Resolver404:
            " `api/register` not found"

    def test_account_url(self):
        try:
            path = resolve('api/account/<int:pk>/')
        except Resolver404:
                "`api/account/<int:pk>` not found"
