from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views 
from .views import UserViewSet, CategoryViewSet, EmployeeProfileViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'all-users', UserViewSet) 
router.register(r'categories', CategoryViewSet)
router.register(r'employees', EmployeeProfileViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    # Custom Auth
    path('users/', views.register_user, name='register_user'),
    path('login/', views.login_view, name='login_view'),
    
    # NEW ROUTES FOR BOOKING AND SCHEDULE:
    path('book-service/', views.book_service, name='book_service'),
    path('my-schedule/', views.get_my_schedule, name='get_my_schedule'),
    path('update-job-status/', views.update_job_status, name='update_job_status'),
    
    # DRF Auto-Generated API Endpoints
    path('', include(router.urls)),
]