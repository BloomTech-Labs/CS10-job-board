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


# Used by Djoser to register users, references in settings.py / DJOSER.SERIALIZERS.user_create
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


class JobPostSerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField()

    class Meta:
        model = JobPost
        fields = (
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
        fields = ('user', 'stripe_customer_id', 'membership')


class PaymentViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
