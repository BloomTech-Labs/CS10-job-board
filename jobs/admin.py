from django.contrib import admin
from jobs.models import JobPost, Employee, Employer, User, Membership

admin.site.register(JobPost)
admin.site.register(Employee)
admin.site.register(Employer)
admin.site.register(User)
admin.site.register(Membership)