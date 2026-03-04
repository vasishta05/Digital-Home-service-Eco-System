from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # This forwards all '/api/' traffic to the services_app!
    path('api/', include('services_app.urls')), 
]