# from django.contrib.auth.models import User
# from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
# from django.core import serializers
# from django.conf import settings, urls
from .models import JobPost, User, UserMembership, Membership
from rest_framework import serializers
from taggit_serializer.serializers import (TagListSerializerField, TaggitSerializer)

 
# Serializers for API representation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'is_employer')


class UserRegistrationSerializer(serializers.ModelSerializer):

    # def create(self, validated_data):
    #     user = User(
    #         email=validated_data['email'],
    #         password=validated_data['password'],
    #         # is_employer=request.is_employer,
    #         # first_name=request.first_name,
    #         # last_name=request.last_name
    #     )
    #     user.set_password(validated_data['password'])
    #     user.save()
    #     return user

    # Encrypts password with create_user
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    class Meta:
        model = User
        fields = (
            'email',
            'password',
            'is_employer',
            'first_name',
            'last_name',
        )


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

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ('membership_type', 'price', 'stripe_plan_id')

class UserMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMembership
        fields = ('user', 'stripe_customer_id', 'membership',)


# May not need these?

# ViewSets for defining view behavior
# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer


# class JobPostViewSet(viewsets.ModelViewSet):
#     queryset = JobPost.objects.all()
#     serializer_class = JobPostSerializer


# class UserMembershipViewSet(viewsets.ModelViewSet):
#     queryset = UserMembership.objects.all()
#     serializer_class = UserMembershipSerializer