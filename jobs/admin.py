from django.contrib import admin
from jobs.models import JobPost, User, UserMembership, Subscription

admin.site.register(JobPost)
admin.site.register(User)
admin.site.register(UserMembership)
admin.site.register(Subscription)