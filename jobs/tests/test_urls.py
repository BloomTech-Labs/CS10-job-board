from django.urls import resolve, Resolver404

class TestUrls:
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

    def test_login_url(self):
        try:
            path = resolve('api/login/')
        except Resolver404:
                "`api/login` not found"

    def test_login_refresh_url(self):
        try:
            path = resolve('api/login/refresh/')
        except Resolver404:
                "`api/login/refresh/` not found"

    def test_login_verify_url(self):
        try:
            path = resolve('api/login/verify/')
        except Resolver404:
                "`api/login/verify/` not found"

    def test_logout_all_url(self):
        try:
            path = resolve('api/logout/all/')
        except Resolver404:
                "`api/logout/all/` not found"
