from .models import JobPost, User, UserMembership, Membership, Payment
from rest_framework import serializers
# Customization of UserSerializer
from rest_framework.utils import model_meta
from .seralizer_helpers import raise_errors_on_nested_writes
from django.contrib.auth.hashers import make_password
# Tag serializer for JobPostSerializer
from taggit_serializer.serializers import (TagListSerializerField, TaggitSerializer)

 
# Serializers for API representation

class JWTSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'is_employer')


class UserRegistrationSerializer(serializers.ModelSerializer):

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


class UserViewSerializer(serializers.ModelSerializer):

    def update(self, user, validated_data):
        raise_errors_on_nested_writes('update', self, validated_data)
        info = model_meta.get_field_info(user)

        if 'password' in validated_data:
            user.password = make_password(
                validated_data.get('password')
            )
            user.save()
            return user
        elif 'email' in validated_data:
            user.email = validated_data.get('email')
            user.save()
            return user

        # From: Django Serializers: https://github.com/encode/django-rest-framework/blob/master/rest_framework/serializers.py#L969
        for attr, value in validated_data.items():
            if attr in info.relations and info.relations[attr].to_many:
                field = getattr(user, attr)
                field.set(value)
            else:
                setattr(user, attr, value)
        user.save()

        return user

    class Meta:
        model = User
        fields = (
            'id',
            'is_employer',
            'email',
            'password',
            'is_active',
            'company_name',
            'company_logo',
            'company_summary',
            'application_inbox',
            'first_name',
            'last_name',
            'profile_photo',
            'created_date'
        )


class UserIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id',)


class JobPostSerializer(TaggitSerializer, serializers.ModelSerializer):
    # url = serializers.HyperlinkedIdentityField(	
    #                         view_name='posts-api:detail',	
    #                         lookup_field='slug'	
    #                         )
    tags = TagListSerializerField()

    class Meta:
        model = JobPost
        fields = '__all__'


class JobPreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = ('id', 'title', 'company_logo', 'description', 'min_salary', 'max_salary')


class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ('membership_type', 'price')


class UserMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMembership
        fields = ('user', 'stripe_customer_id', 'membership')


class PaymentViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
