import uuid
from djoser.views import UserView, UserDeleteView
from djoser import serializers
from rest_framework import views, permissions, status
from rest_framework.response import Response
from rest_framework import permissions
from .models import User, JobPost, Membership
from rest_framework import views, permissions, status, generics
from rest_framework.response import Response
from django.shortcuts import render
from django.views.generic import ListView
# import JobPost serializer
from .api import JobPostSerializer

class UserLogoutAllView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, *args, **kwargs):
        user = request.user
        user.jwt_secret = uuid.uuid4()
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

# setting up views for HTTP requests
class ListJobPost(generics.ListCreateAPIView):
    queryset = JobPost.objects.all()
    serializer_class = JobPostSerializer

class DetailJobPost(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobPost.objects.all()
    serializer_class = JobPostSerializer

# for selecting a paid membership
class MembershipSelectView(ListView):
    model = Membership
