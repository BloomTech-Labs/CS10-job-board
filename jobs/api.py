# from django.contrib.auth.models import User
# from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
# from django.core import serializers
# from django.conf import settings, urls
from django.utils import timezone

from .models import JobPost, User, UserMembership, Membership, Payment
from rest_framework import serializers
from taggit_serializer.serializers import (TagListSerializerField, TaggitSerializer)

 
# Serializers for API representation 

class JWTSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'is_employer')


class UserIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id',)


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

    # Encrypts password with create_user=Django default create user method 
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
    url = serializers.HyperlinkedIdentityField(
                            view_name='posts-api:detail',
                            lookup_field='slug'
                            )
    tags = TagListSerializerField()
    # company = UserIDSerializer()

    # def create(self, validated_data):
    #     company = self.context['request'].user
    #     request = self.context['request']
    #     # is_active = hasattr(request.data, 'is_active')
    #     is_active = request.data['is_active']
    #     print(is_active, request.data)

    #     if request.data['is_active'] is True:
    #         request.data['published_date'] = timezone.now()
    #         print(request.data['published_date'])

    #     job_post = JobPost.objects.create(
    #         company=company,
    #         published_date=published_date,
    #         **validated_data
    #     )
    #     return job_post

    class Meta:
        model = JobPost
        fields = [
            'url',
            'slug',
            'company',
            'company_name',
            'title',
            'company_logo',
            'description',
            'job_location',
            'requirements',
            'min_salary',
            'max_salary',
            'is_active',
            'tags',
            'created_date',
            'published_date'
        ]


class JobPreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = ('id', 'title', 'company_logo', 'description', 'min_salary', 'max_salary')


class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ('membership_type', 'price', 'stripe_plan_id')


class UserMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMembership
        fields = ('user', 'stripe_customer_id', 'membership')


class PaymentViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
