import uuid
# from djoser.views import UserView, UserDeleteView
# from djoser import serializers
# from django.shortcuts import render
from django.conf import settings
from django.utils import timezone
from django.views.generic import ListView
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.shortcuts import render, redirect

# Rest Framework
from rest_framework import views, permissions, status, authentication, generics
from rest_framework.response import Response
# JWT
import rest_framework_jwt.authentication
# Models
from .models import User, JobPost, Membership, UserMembership, Subscription
# Serializers
from .api import JobPostSerializer, JobPreviewSerializer, UserSerializer, UserRegistrationSerializer, MembershipSerializer
import stripe

def jwt_get_secret_key(user_model):
    return user_model.jwt_secret


def jwt_response_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': UserSerializer(user, context={'request': request}).data
    }


class UserRegisterView(generics.CreateAPIView):
    authentication_classes = [
        rest_framework_jwt.authentication.JSONWebTokenAuthentication,
        authentication.SessionAuthentication,
        authentication.BasicAuthentication
    ]
    permission_classes = [permissions.IsAuthenticated]


class UserLogoutAllView(views.APIView):
    authentication_classes = [
        rest_framework_jwt.authentication.JSONWebTokenAuthentication,
        authentication.SessionAuthentication,
        authentication.BasicAuthentication
    ]
    permission_classes = [permissions.IsAuthenticated]
    # Resets the jwt_secret, invalidating all token issued
    def post(self, request, *args, **kwargs):
        user = request.user
        user.jwt_secret = uuid.uuid4()
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# setting up views for HTTP requests
class ListJobPost(generics.ListAPIView):
    # returns first 10 most recently published jobs
    queryset = JobPost.objects.exclude(published_date=None)[:10]
    serializer_class = JobPreviewSerializer


class CreateJobPost(generics.CreateAPIView):
    serializer_class = JobPostSerializer
    authentication_classes = [
        rest_framework_jwt.authentication.JSONWebTokenAuthentication,
        authentication.SessionAuthentication,
        authentication.BasicAuthentication
    ]
    permission_classes = [permissions.IsAuthenticated]

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


########### Membership Views and Methods ###########

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

def get_selected_membership(request):
	membership_type = request.session['selected_membership_type']
	selected_membership_qs = Membership.objects.filter(
				membership_type=membership_type)
	if selected_membership_qs.exists():
		return selected_membership_qs.first()
	return None
  
# for selecting a paid membership 
class MembershipSelectView(generics.ListAPIView):
    model = Membership
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    authentication_classes = [
        rest_framework_jwt.authentication.JSONWebTokenAuthentication,
        authentication.SessionAuthentication,
        authentication.BasicAuthentication
    ]
    permission_classes = [permissions.IsAuthenticated]

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        current_membership = get_user_membership(self.request)
        context['current_membership'] = str(current_membership.membership)
        # print(context)

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



# Tokenizes purchase
# class PaymentView(generics.CreateAPIView):

# 	user_membership = get_user_membership(request)
# 	selected_membership = get_selected_membership(request)
# 	publishKey = settings.STRIPE_PUBLISHABLE_KEY

# 	if request.method == "POST":
# 		try:
# 			token = request.POST['stripeToken']
# 			subscription = stripe.Subscription.create(
# 			  customer=user_membership.stripe_customer_id,
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
# 		del request.session['selected_membership_type']
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


# 	free_membership = Membership.objects.filter(membership_type='Free').first()
# 	user_membership = get_user_membership(request)
# 	user_membership.membership = free_membership
# 	user_membership.save()

# 	messages.info(request, "Successfully cancelled membership. We have sent an email")
# 	# sending an email here

# 	return redirect('/memberships')
