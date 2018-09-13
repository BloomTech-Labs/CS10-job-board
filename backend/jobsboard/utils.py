# Adds a new user field when a token is generated
from jobs.api import UserSerializer

def my_jwt_response_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': UserSerializer(user, context={'request': request}).data
    }