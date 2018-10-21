from django.test import Client
import inspect


from jobs.views import UserCreateView, UserIDSerializer, UserLogoutAllView, UserView, PostPageNumberPagination, CompanyPostPageNumberPagination, ListJobPost, ViewJobPost, ModifyJobPost, ListCompanyJobPosts, UserPaymentView

# Tests all instances of classes in view.py. May need to check for some errors (unexpected keyword argument) in views.py
class TestViewInstances():

    def test_set_up_user_create_view(self):
        inspect.isclass(UserCreateView)

    def test_set_up_user_id_serializer(self):
        inspect.isclass(UserIDSerializer)

    def test_set_up_user_logout_view(self):
        inspect.isclass(UserLogoutAllView)

    def test_set_up_user_view(self):
        inspect.isclass(UserView)

    def test_set_up_pagination(self):
        inspect.isclass(PostPageNumberPagination)

    def test_set_up_company_pagination(self):
        inspect.isclass(CompanyPostPageNumberPagination)

    def test_set_up_list_job_post(self):
        inspect.isclass(ListJobPost)

    def test_set_up_view_job_post(self):
        inspect.isclass(ViewJobPost)

    def test_set_up_modify_job_post(self):
        inspect.isclass(ModifyJobPost)

    def test_set_up_list_company_posts(self):
        inspect.isclass(ListCompanyJobPosts)

    def test_set_up_payment_view(self):
        inspect.isclass(UserPaymentView)

    
