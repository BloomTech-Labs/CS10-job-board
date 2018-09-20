from django.contrib import admin
from .models import JobPost, Employee, Employer, User

admin.site.register(JobPost)
admin.site.register(Employee)
admin.site.register(Employer)
admin.site.register(User)
