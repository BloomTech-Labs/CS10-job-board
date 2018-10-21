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
from django.views.generic import ListView

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
from .models import User, JobPost, UserMembership, Subscription, Payment

# Serializers
from .api import (
    JobPostSerializer,
    JobPreviewSerializer,
    UserIDSerializer,
    UserRegistrationSerializer,
    UserViewSerializer,
    UserMembershipSerializer,
    PaymentViewSerializer,
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

    # Methods update, perform_update, partial_update, destroy, perform_destory
    #   all from Django REST Framework source-code mixins:
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

    def perform_update(self, serializer):
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        # Checks user id on request == user id making delete request:
        #   (prevents company 1 deleting for company 2)
        if user.pk is not self.request.user.pk:
            message = {'FORBIDDEN'}
            return Response(message, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(user)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()


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

    # Methods update, perform_update, partial_update, destroy, perform_destory
    #   all from Django REST Framework source-code mixins:
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

    def perform_update(self, serializer):
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        job = self.get_object()
        # Checks job id on request == user id making delete request:
        #   (prevents company 1 deleting for company 2)
        if job.company.pk is not self.request.user.pk:
            message = {'FORBIDDEN'}
            return Response(message, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(job)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()


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
        # print('REQUEST>>>>', request.user.pk)

        # Checks company id on request == user id making post request:
        #   (prevents company 1 posting for company 2)
        if request.data['company'] is not self.request.user.pk:
            message = {'FORBIDDEN'}
            return Response(message, status=status.HTTP_403_FORBIDDEN)
        # If job post is published, set published_date to current time
        if request.data['is_active'] is True:
            request.data['published_date'] = timezone.now()
        # print('REQUEST>>>>', request.data)
        serializer = self.get_serializer(data=request.data)
        # print('SERIALIZER>>>>>>', serializer)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # print('SERIALIZER.DATA>>>>>>', serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


########### Membership & Stripe ###########


class PaymentView(generics.CreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentViewSerializer
    authentication_classes = (
        rest_framework_jwt.authentication.JSONWebTokenAuthentication,
        authentication.SessionAuthentication,
        authentication.BasicAuthentication
    )
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        print(request.data)
        # membership_exists = get_user_membership(request.user.pk)
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


class UserMembershipView(views.APIView):
    model = UserMembership
    serializer_class = UserMembershipSerializer
    authentication_classes = (
        rest_framework_jwt.authentication.JSONWebTokenAuthentication,
        authentication.SessionAuthentication,
        authentication.BasicAuthentication
    )
    permission_classes = (permissions.IsAuthenticated,)


def get_user_membership(id):
    user_membership = UserMembership.objects.filter(id=id)
    if user_membership.exists():
        return True
    return False


# def get_user_subscription(request):
#     user_subscription_qs = Subscription.objects.filter(
#         user_membership=get_user_membership(request))
#     if user_subscription_qs.exists():
#         user_subscription = user_subscription_qs.first()
#         return user_subscription
#     return None


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


# def get_selected_membership(request):
#     membership_type = request.session['selected_membership_type']
#     selected_membership_qs = Membership.objects.filter(
#         membership_type=membership_type)
#     if selected_membership_qs.exists():
#         return selected_membership_qs.first()
#     return None
#     membership = request.session['selected_membership']
#     selected_membership_qs = UserMembership.objects.filter(
#             membership=membership)
    
#     if selected_membership_qs.exists():
#         return selected_membership_qs.first()
#         return None


# for selecting a paid membership
# class UserMembershipView(generics.ListCreateAPIView):
#     model = UserMembership
#     serializer_class = UserMembershipSerializer
#     authentication_classes = (
#         rest_framework_jwt.authentication.JSONWebTokenAuthentication,
#         authentication.SessionAuthentication,
#         authentication.BasicAuthentication
#     )
#     permission_classes = (permissions.IsAuthenticated,)

#     def get_queryset(self):
#         id = self.request.user.id
#         queryset = UserMembership.objects.filter(id=id)
#         return queryset

#     def get_context_data(self, *args, **kwargs):
#         context = super().get_context_data(**kwargs)
#         current_membership = get_user_membership(self.request)
#         context['current_membership'] = str(current_membership.membership)
#         # print(context)

#         return context

#     def post(self, request, **kwargs):
#         selected_membership = request.POST.get('membership')
#         user_subscription = get_user_subscription(request)
#         user_membership = get_user_membership(request)

#         selected_membership_qs = UserMembership.objects.filter(
#             membership=selected_membership
#         )
#         if selected_membership_qs.exists():
#             selected_membership = selected_membership_qs.first()

#         '''
#         ============
#         VALIDATION
#         ============
#         '''
#         if user_membership.membership == selected_membership:
#             if user_subscription != None:
#                 messages.info(request, "You already have this membership. Your next payment is due {}".format(
#                     'get this value from Stripe'))
#                 return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

#         #assign any changes to membership type to the session
#         request.session['selected_membership'] = selected_membership.membership
#         return HttpResponseRedirect(reverse('memberships:payment'))


# Tokenizes purchase
# class PaymentView(generics.CreateAPIView):

# 	user_membership = get_user_membership(request)
# 	selected_membership = get_selected_membership(request)
# 	publishKey = settings.STRIPE_PUBLISHABLE_KEY


# 	if request.method == "POST":
# 		try:
# 			token = request.POST['stripeToken']
# 			subscription = stripe.Subscription.create(
# 			  customer=user_membership.stripe_id,
# 			  items=[
# 			    {
# 			      "plan": selected_membership.stripe_plan_id,
# 			    },
# 			  ],
# 			  source=token # 4242424242424242
# 			)

# 			return redirect(reverse('memberships:update-transactions',
# 				kwargs={
# 					'subscription_id': subscription.id
# 				}))

# 		except stripe.CardError as e:
# 			messages.info(request, "Your card has been declined")

# 	context = {
# 		'publishKey': publishKey,
# 		'selected_membership': selected_membership
# 	}

# 	return render(request, "templates/membership_payment.html", context)


# def updateTransactionRecords(request, subscription_id):
# 	user_membership = get_user_membership(request)
# 	selected_membership = get_selected_membership(request)

# 	user_membership.membership = selected_membership
# 	user_membership.save()

# 	sub, created = Subscription.objects.get_or_create(user_membership=user_membership)
# 	sub.stripe_subscription_id = subscription_id
# 	sub.active = True
# 	sub.save()

# 	try:
# 		del request.session['selected_membership']
# 	except:
# 		pass

# 	messages.info(request, 'Successfully created {} membership'.format(selected_membership))
# 	return redirect('/memberships')


# def cancelSubscription(request):
# 	user_sub = get_user_subscription(request)

# 	if user_sub.active == False:
# 		messages.info(request, "You dont have an active membership")
# 		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

# 	sub = stripe.Subscription.retrieve(user_sub.stripe_subscription_id)
# 	sub.delete()

# 	user_sub.active = False
# 	user_sub.save()


# 	free_membership = UserMembership.objects.filter(membership='Free').first()
# 	user_membership = get_user_membership(request)
# 	user_membership.membership = free_membership
# 	user_membership.save()

# 	messages.info(request, "Successfully cancelled membership. We have sent an email")
# 	# sending an email here

# 	return redirect('/memberships')
