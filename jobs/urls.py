from django.conf.urls import re_path
from django.urls import path
from django.contrib.auth import get_user_model

from djoser import views as djoser_views
from rest_framework_jwt import views as jwt_views
from jobs import views
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()


User = get_user_model()

# Assign custom paths for views 

urlpatterns = [
    re_path(r'^view/$', views.UserView.as_view(), name='view'),
    re_path(r'^delete/$', views.UserDeleteView.as_view(), name='delete'),
    re_path(r'^logout/all/$', views.UserLogoutAllView.as_view(), name='logout-all'),

   
    re_path(r'^register/$', djoser_views.UserCreateView.as_view(), name='register'),

    re_path(r'^login/$', jwt_views.ObtainJSONWebToken.as_view(), name='login'),
    re_path(r'^login/refresh/$', jwt_views.RefreshJSONWebToken.as_view(), name='login-refresh'),

 # Setting up paths for JobPosts
    path('jobs/', views.ListJobPost.as_view()),
    path('jobs/<int:pk>/', views.DetailJobPost.as_view())

]