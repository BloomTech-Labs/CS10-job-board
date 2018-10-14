from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
# from djoser import views as djoser_views
from rest_framework_jwt import views as jwt_views
from rest_framework.routers import DefaultRouter
# imports all views
from jobs import views

router = DefaultRouter()

######## NOTES ##########
# Djoser view methods: https://github.com/sunscrapers/djoser/blob/master/djoser/views.py
#########################

# Assign custom paths for views

urlpatterns = [
    # re_path(r'^view/$', views.UserView.as_view(), name='view'),
    # re_path(r'^delete/$', views.UserDeleteView.as_view(), name='delete'),

    # Using Djoser to handle registration email/password reset
    path('register/', views.UserCreateView.as_view(), name='register'),
    # Account operations except create
    path('account/<int:pk>/', views.UserView.as_view(), name='account'),

    # JWT API
    path('login/', jwt_views.ObtainJSONWebToken.as_view(), name='login'),
    # Use to refresh token on login
    path('login/refresh/', jwt_views.RefreshJSONWebToken.as_view(), name='login-refresh'),
    # Use for account operations / billing charges
    path('login/verify/', jwt_views.VerifyJSONWebToken.as_view(), name='login-verify'),
    # Use logout/all/ for password reset/sign out all sessions
    path('logout/all/', views.UserLogoutAllView.as_view(), name='logout-all'),

    # Jobs API
    path('jobs/', views.ListJobPost.as_view()),
    # Invidual job view
    path('jobs/<int:pk>/', views.ViewJobPost.as_view()),
    # Jobs posted by a company user
    path('company/jobs/', views.ListCompanyJobPosts.as_view()),
    path('company/jobs/<int:pk>/', views.ModifyJobPost.as_view()),
    # path('memberships/', (name='membership')),

    # Setting up for Membership types
    path('memberships/', views.MembershipSelectView.as_view(), name='membership'),
    path('pay/', views.PaymentView.as_view(), name='pay'),
    # path('update-transactions/<subscription_id>/', views.updateTransactionRecords, name='update-transactions'),
    # path('cancel/', views.cancelSubscription, name='cancel')

]

# Adds a local media server if DEBUG=True: 
# https://docs.djangoproject.com/en/2.1/howto/static-files/#serving-files-uploaded-by-a-user-during-development
# if settings.DEBUG:
#     # static files (images, css, javascript, etc.)
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)