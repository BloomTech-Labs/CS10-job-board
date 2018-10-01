import uuid
from djoser.views import UserView, UserDeleteView
from djoser import serializers
from rest_framework import views, permissions, status
from rest_framework.response import Response
from rest_framework import permissions
from .models import User, JobPost, Membership, UserMembership
from rest_framework import views, permissions, status, generics
from rest_framework.response import Response
from django.shortcuts import render
from django.views.generic import ListView
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
    serializer_class = JobPostSerializer


class DetailJobPost(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobPost.objects.all()
    serializer_class = JobPostSerializer

def get_user_membership(request):
    user_membership_qs = UserMembership.objects.filter(user=request.user)
    if user_membership_qs.exists():
        return user_membership_qs.first()
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
