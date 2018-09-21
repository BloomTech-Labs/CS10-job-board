from django.contrib import admin
from jobs.models import JobPost, Employee, Employer, User, Membership, UserMembership, Subscription

admin.site.register(JobPost)
admin.site.register(Employee)
admin.site.register(Employer)
admin.site.register(User)
admin.site.register(Membership)
admin.site.register(UserMembership)
admin.site.register(Subscription)