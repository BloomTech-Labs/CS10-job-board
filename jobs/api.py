#from django.contrib.auth.models import User
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager

from .models import Employer, Employee, JobPost, User, UserMembership

from django.conf import settings, urls
from rest_framework import serializers, viewsets
from .models import Employer, Employee, JobPost, User
from taggit_serializer.serializers import (TagListSerializerField, TaggitSerializer)

 
# Serializers for API representation

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff')


class JobPostSerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField()

    class Meta:
        model = JobPost
        fields = (
            'id',
            'company_name',
            'title',
            'description',
            'job_location',
            'requirements',
            'min_salary',
            'max_salary',
            'is_active',
            'tags',
            'created_date',
            'published_date')


class JobPreviewSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = JobPost
        fields = ('id', 'title', 'description', 'min_salary', 'max_salary')


class UserMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMembership
        fields = ('user', 'stripe_customer_id', 'membership',)        

# ViewSets for defining view behavior
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class JobPostViewSet(viewsets.ModelViewSet):
    queryset = JobPost.objects.all()
    serializer_class = JobPostSerializer

class UserMembershipViewSet(viewsets.ModelViewSet):
    queryset = UserMembership.objects.all()
    serializer_class = UserMembershipSerializer