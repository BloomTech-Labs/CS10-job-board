"""jobsboard URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.contrib import admin
from django.urls import path, re_path, include

from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter

from jobs.urls import urlpatterns

from jobs.views import UserLogoutAllView,send_email

# Routers for automatically determining the URL configuration
router = DefaultRouter()


#refresh non-expired tokens and add verification endpoint 
#from rest_framework_jwt.views import refresh_jwt_token, verify_jwt_token


# Wire up our API using automatic URL routing.
urlpatterns = [
    # For using API (login and logout views)
    # re_path(r'^api/jobs', include('jobs.urls')),
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/', include('jobs.urls')),
    path('memberships/', include('jobs.urls', namespace='membership')),
    # Configure sendgrid 
    re_path(r'^sendgrid/', send_email, name='sendgrid'),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

