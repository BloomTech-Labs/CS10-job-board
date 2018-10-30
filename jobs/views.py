import os
import uuid
from decouple import config

# Django
from django.conf import settings
from django.contrib import messages
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, redirect
from django.template import Context
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils import timezone

# SendGrid
import sendgrid
from sendgrid.helpers.mail import *

# Permissions
from .permissions import IsOwnerOrReadOnly


# REST Framework
from rest_framework import views, permissions, status, authentication, generics, pagination
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

# JWT REST
import rest_framework_jwt.authentication

# Models
from .models import User, JobPost, UserMembership, UserPayment

# Serializers
from .api import (
    JobPostSerializer,
    JobPreviewSerializer,
    UserIDSerializer,
    UserRegistrationSerializer,
    UserViewSerializer,
    UserMembershipSerializer,
    UserPaymentViewSerializer,
    JWTSerializer
)
import stripe


################### NOTES ######################
# User creation is handled by Djoser, in settings.py / DJOSER / SERIALIZERS
# Django REST Framework Generics reference: https://www.django-rest-framework.org/api-guide/generic-views/
# Django REST Framework Views reference: https://www.django-rest-framework.org/api-guide/views/
################################################

def jwt_get_secret_key(user):
    return user.jwt_secret


# determines extra field `user` added to returned JWT (payload itself is determined by payload_handler-> see jwt_config.py)
def jwt_response_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': JWTSerializer(user, context={'request': request}).data
    }


class UserCreateView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    # Methods create, perform_create, get_success_headers
    #   all from Django REST Framework source-code mixins:
    # https://github.com/encode/django-rest-framework/blob/master/rest_framework/mixins.py
    # To customize, must overwrite but also add in default source-code.

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()

    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}


# Create custom view because auth is handles by Django REST framework JWT Auth (not Djoser)
class UserView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserViewSerializer
    authentication_classes = (
        rest_framework_jwt.authentication.JSONWebTokenAuthentication,
        authentication.SessionAuthentication,
        authentication.BasicAuthentication
        )
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser,)

    def get_queryset(self):
        id = self.request.user.pk
        return User.objects.filter(id=id)

    # Methods update, destroy all from Django REST Framework source-code mixins:
    # https://github.com/encode/django-rest-framework/blob/master/rest_framework/mixins.py
    # To customize, must overwrite but also add in default source-code.

    def update(self, request, *args, **kwargs):
        user = self.get_object()

        # Check job company id matches user id
        if user.pk is not self.request.user.pk:
            message = {'FORBIDDEN'}
            return Response(message, status=status.HTTP_403_FORBIDDEN)

        # Determines if PUT or PATCH request
        partial = kwargs.pop('partial', False)
        if partial is False:
            message = {"detail": "Method \"PUT\" not allowed."}
            return Response(message, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        serializer = self.get_serializer(
            user, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(user, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the user.
            user._prefetched_objects_cache = {}

        return Response(status=status.HTTP_204_NO_CONTENT)

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        # Checks user id on request == user id making delete request:
        #   (prevents company 1 deleting for company 2)
        if user.pk is not self.request.user.pk:
            message = {'FORBIDDEN'}
            return Response(message, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(user)
        return Response(status=status.HTTP_204_NO_CONTENT)


# Resets the jwt_secret, invalidating all token issued
class UserLogoutAllView(views.APIView):
    authentication_classes = (
        rest_framework_jwt.authentication.JSONWebTokenAuthentication,
        authentication.SessionAuthentication,
        authentication.BasicAuthentication
    )
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user = request.user
        user.jwt_secret = uuid.uuid4()
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PostPageNumberPagination(pagination.PageNumberPagination):
    page_size = 10
    # Method allowed from client to change query page_size
    page_size_query_param = 'post'
    # Max amount allowed from client request's to change page_size
    max_page_size = 100


class CompanyPostPageNumberPagination(pagination.PageNumberPagination):
    page_size = 25
    # Method allowed from client to change query page_size
    page_size_query_param = 'post'
    # Max amount allowed from client request's to change page_size
    max_page_size = 100


class ListJobPost(generics.ListCreateAPIView):
    # returns first 10 most recently published jobs
    queryset = JobPost.objects.exclude(published_date=None)
    serializer_class = JobPreviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = PostPageNumberPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ViewJobPost(generics.ListAPIView):
    serializer_class = JobPostSerializer

    # Override queryset: returns object whose id matches int passed in url params (self.kwargs)
    def get_queryset(self):
        return JobPost.objects.filter(id=self.kwargs['pk'])


class ModifyJobPost(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobPostSerializer
    authentication_classes = (
        rest_framework_jwt.authentication.JSONWebTokenAuthentication,
        authentication.SessionAuthentication,
        authentication.BasicAuthentication
    )
    permission_classes = (permissions.IsAuthenticated,)

    # Methods update, destroy from Django REST Framework source-code mixins:
    # https://github.com/encode/django-rest-framework/blob/master/rest_framework/mixins.py
    # To customize, must overwrite but also add in default source-code.

    # Override queryset: returns object whose id matches int passed in url params (self.kwargs)
    def get_queryset(self):
        return JobPost.objects.filter(id=self.kwargs['pk'])

    def update(self, request, *args, **kwargs):
        job = self.get_object()
        # Check job company id matches user id
        if job.company.pk is not self.request.user.pk:
            message = {'FORBIDDEN'}
            return Response(message, status=status.HTTP_403_FORBIDDEN)

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        job = self.get_object()
        # Checks job id on request == user id making delete request:
        #   (prevents company 1 deleting for company 2)
        if job.company.pk is not self.request.user.pk:
            message = {'FORBIDDEN'}
            return Response(message, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(job)
        return Response(status=status.HTTP_204_NO_CONTENT)


# Returns list of Jobs posted by a company account
class ListCompanyJobPosts(generics.ListCreateAPIView):
    serializer_class = JobPostSerializer
    authentication_classes = (
        rest_framework_jwt.authentication.JSONWebTokenAuthentication,
        authentication.SessionAuthentication,
        authentication.BasicAuthentication
    )
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = CompanyPostPageNumberPagination
    # lookup_field = "company"

    def get_queryset(self):
        company = self.request.user
        queryset = JobPost.objects.filter(company=company)

        published = self.request.query_params.get('published', None)
        unpublished = self.request.query_params.get('unpublished', None)
        if published is not None:
            queryset = queryset.filter(is_active=True)
        if unpublished is not None:
            queryset = queryset.filter(is_active=False).order_by('-created_date')
        return queryset

    def post(self, request, *args, **kwargs):

        # Checks company id on request == user id making post request:
        #   (prevents company 1 posting for company 2)
        if request.data['company'] is not self.request.user.pk:
            message = {'FORBIDDEN'}
            return Response(message, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


########### SendGrid ###########


def send_email(request):
    sg = sendgrid.SendGridAPIClient(
        apikey=config('SENDGRID_API_KEY')
    )
    from_email = Email('contact@openjobsource.com')
    to_email = Email('cs10jobboard@gmail.com')
    subject = 'Testing!'
    msg_html = render_to_string(
        'templates/email_confirm.html', {'email': sendgrid})
    content = Content(
        html_message=msg_html,
    )
    mail = Mail(from_email, subject, to_email, content)
    response = sg.client.mail.send.post(request_body=mail.get())

    return HttpResponse('Email sent!')


########### Membership & Stripe ###########


class UserPaymentView(generics.CreateAPIView):
    queryset = UserPayment.objects.all()
    serializer_class = UserPaymentViewSerializer
    authentication_classes = (
        rest_framework_jwt.authentication.JSONWebTokenAuthentication,
        authentication.SessionAuthentication,
        authentication.BasicAuthentication
    )
    permission_classes = (permissions.IsAuthenticated,)


class UserMembershipView(generics.CreateAPIView, generics.RetrieveUpdateAPIView):
    model = UserMembership
    serializer_class = UserMembershipSerializer
    authentication_classes = (
        rest_framework_jwt.authentication.JSONWebTokenAuthentication,
        authentication.SessionAuthentication,
        authentication.BasicAuthentication
    )
    permission_classes = (permissions.IsAuthenticated,)

    # Override retrieve Django REST mixin
    def retrieve(self, request, *args, **kwargs):
        instance = UserMembership.objects.filter(user_id=request.user.pk).first()
        if instance is not None:
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    # Override update Django REST mixiin
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = UserMembership.objects.filter(user_id=request.user.pk).first()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
