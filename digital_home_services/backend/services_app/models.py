from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('CUSTOMER', 'Customer'),
        ('EMPLOYEE', 'Employee'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CUSTOMER')
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

class Category(models.Model):
    name = models.CharField(max_length=100) # e.g., Cleaning, Plumbing, Carpentry
    description = models.TextField()

    def __str__(self):
        return self.name

class EmployeeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'role': 'EMPLOYEE'})
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    experience_years = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.category.name if self.category else 'No Category'}"

class Booking(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('COMPLETED', 'Completed'),
    )
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_bookings')
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='assigned_jobs')
    service_date = models.DateField()
    service_time = models.CharField(max_length=20, null=True, blank=True)
    
    # --- ADD THESE TWO NEW LINES ---
    payment_method = models.CharField(max_length=50, default='Pay After Service')
    amount = models.CharField(max_length=20, default='89.99')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    feedback = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.customer.username} booked {self.employee.user.username}"