from django.contrib import admin
from .models import User, Category, EmployeeProfile, Booking

admin.site.register(User)
admin.site.register(Category)
admin.site.register(EmployeeProfile)
admin.site.register(Booking)