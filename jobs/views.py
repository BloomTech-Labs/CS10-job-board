import uuid
from djoser.views import UserView, UserDeleteView
from djoser import serializers
from rest_framework import views, permissions, status
from rest_framework.response import Response
from rest_framework import permissions
from .models import User, JobPost, Membership, UserMembership, Subscription
from rest_framework import views, permissions, status, generics
from rest_framework.response import Response
from django.shortcuts import render
from django.utils import timezone
from django.views.generic import ListView
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib import messages
# import JobPost serializer
from .api import JobPostSerializer, JobPreviewSerializer


class UserLogoutAllView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        user.jwt_secret = uuid.uuid4()
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# setting up views for HTTP requests
class ListJobPost(generics.ListAPIView):
    queryset = JobPost.objects.exclude(published_date=None)[:10]
    serializer_class = JobPreviewSerializer


class CreateJobPost(generics.CreateAPIView):

    def post(self, request):
        if request.data['is_active'] is True:
            # If published when created,
            # add published_date to request data to then be serialized
            request.data['published_date'] = timezone.now()
            serializer_class = JobPostSerializer(data=request.data)
            serializer_class.is_valid()
            serializer_class.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            serializer_class = JobPostSerializer(data=request.data)
            serializer_class.save()
            return Response(status=status.HTTP_201_CREATED)


class DetailJobPost(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobPost.objects.all()
    serializer_class = JobPostSerializer


def get_user_membership(request):
    user_membership_qs = UserMembership.objects.filter(user=request.user)
    if user_membership_qs.exists():
        return user_membership_qs.first()
    return None

def get_user_subscription(request):
    user_subscription_qs = Subscription.objects.filter(user_membership=get_user_membership(request))
    if user_subscription_qs.exists():
        user_subscription = user_subscription_qs.first()
        return user_subscription
    return None

# for selecting a paid membership
class MembershipSelectView(ListView):
    # model = Membership
    # queryset = JobPost.objects.all()
    # serializer_class = JobPostSerializer

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        current_membership = get_user_membership(self.request)
        context['current_membership'] = str(current_membership.membership)
        return context
    
    def post(self, request, **kwargs):
        selected_membership_type = request.POST.get('membership_type')
        user_subscription = get_user_subscription(request)
        user_membership = get_user_membership(request)

        selected_membership_qs = Membership.objects.filter(
            membership_type = selected_membership_type
        )
        if selected_membership_qs.exists():
            selected_membership = selected_membership_qs.first()

        '''
        ============
        VALIDATION
        ============
        '''
        if user_membership.membership == selected_membership:
            if user_subscription != None:
                messages.info(request, "You already have this membership. Your next payment is due {}".format('get this value from Stripe'))
                return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

        #assign any changes to membership type to the session
        request.session['selected_membership_type'] = selected_membership.membership_type
        return HttpResponseRedirect(reverse('memberships:payment'))