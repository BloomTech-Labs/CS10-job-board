import os
import uuid
from django.conf import settings 
from django.http import HttpResponse

import sendgrid
from sendgrid.helpers.mail import *
#from django.core.mail import send_mail
from djoser.views import UserView, UserDeleteView
from djoser import serializers
from rest_framework import views, permissions, status, generics
from rest_framework.response import Response
from rest_framework import permissions
from django.views.generic import ListView
from rest_framework.response import Response
from .models import User, JobPost, Membership


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

# for selecting a paid membership
class MembershipSelectView(ListView):
    # model = Membership
    queryset = JobPost.objects.all()
    serializer_class = JobPostSerializer

def contact(request):
    sg = sendgrid.SendGridAPIClient(
        apikey=os.environ.get('SENDGRID_API_KEY')
    )
    from_email = Email('test@example.com')
    to_email = Email('cs10jobboard@gmail.com')
    subject = 'Testing!'
    content = Content(
        'text/plain',
        'hello, world'
    )
    mail = Mail(from_email, subject, to_email, content)
    response = sg.client.mail.send.post(request_body=mail.get())

    return HttpResponse('Email Sent!')