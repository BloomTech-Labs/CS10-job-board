from .models import JobPost, User, UserMembership, Membership, Payment
from rest_framework import serializers
from taggit_serializer.serializers import (TagListSerializerField, TaggitSerializer)

 
# Serializers for API representation

class JWTSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'is_employer')


class UserViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'is_employer',
            'email',
            'password',
            'is_active',
            'is_staff',
            'company_name',
            'company_logo',
            'company_summary',
            'applications_inbox',
            'first_name',
            'last_name',
            'profile_photo',
            'created_date'
        )


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
