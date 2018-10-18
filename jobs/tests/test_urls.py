from django.urls import resolve, Resolver404

# Tests for Djoser auth routes
class TestDjoserUrls:
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

# Tests for JWT auth routes
class TestJWTUrls:
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

# Tests for job routes
class TestJobsUrls:
    def test_jobs(self):
        try:
            path = resolve('api/jobs/')
        except Resolver404:
                "`api/jobs/` not found"

    def test_jobs_pk_url(self):
        try:
            path = resolve('api/jobs/<int:pk>')
        except Resolver404:
                "`api/jobs/<int:pk>` not found"

    def test_company_jobs_url(self):
        try:
            path = resolve('api/company/jobs')
        except Resolver404:
                "`api/company/jobs` not found"

    def test_company_jobs_pk_url(self):
        try:
            path = resolve('api/company/jobs/<int:pk>/')
        except Resolver404:
                "`api/company/jobs/<int:pk>/` not found"

# Tests for membership routes
class TestMembershipUrls:
    def test_membership_url(self):
        try:
            path = resolve('api/membership')
        except Resolver404:
                "`api/membership` not found"

    def test_pay_url(self):
        try:
            path = resolve('api/pay')
        except Resolver404:
                "`api/pay` not found"
