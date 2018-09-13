from django.contrib import admin
from .models import JobPost, Employee, Employer

admin.site.register(JobPost)
admin.site.register(Employee)
admin.site.register(Employer)
