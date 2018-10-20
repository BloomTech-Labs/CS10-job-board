from django.test import Client
import inspect
from jobs.views import UserCreateView, UserIDSerializer, UserLogoutAllView, UserView, PostPageNumberPagination, CompanyPostPageNumberPagination, ListJobPost, ViewJobPost, ModifyJobPost, ListCompanyJobPosts, MembershipSelectView, PaymentView

class TestViews():
    # Set up a client to test with
    def test_set_up(self):
        inspect.isclass(UserCreateView)

    