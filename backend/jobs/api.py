from django.contrib.auth.models import User
from django.conf import settings, urls
from rest_framework import serializers, viewsets, routers 
from .models import Employer, Employee, JobPost


# Serializers for API representation
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff')

# ViewSets for defining view behavior
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


