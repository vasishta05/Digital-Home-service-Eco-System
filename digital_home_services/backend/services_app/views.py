from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from .models import User, Category, EmployeeProfile, Booking
from .serializers import UserSerializer, CategorySerializer, EmployeeProfileSerializer, BookingSerializer
import json

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            phone = data.get('phone', '') 
            
            frontend_role = data.get('role', 'User')
            db_role = 'EMPLOYEE' if frontend_role == 'Service Man' else 'CUSTOMER'

            user = User.objects.create_user(username=username, email=email, password=password)
            user.role = db_role
            user.phone = phone
            user.save()

            if db_role == 'EMPLOYEE':
                category_name = data.get('category_name')
                if category_name:
                    category = Category.objects.filter(name=category_name).first()
                    if category:
                        EmployeeProfile.objects.create(user=user, category=category, experience_years=1)

            return JsonResponse({'message': 'Account created successfully!'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            user = authenticate(username=username, password=password)
            
            if user is not None:
                if user.is_superuser or user.role == 'ADMIN':
                    frontend_role = 'Admin'
                elif user.role == 'EMPLOYEE':
                    frontend_role = 'Service Man'
                else:
                    frontend_role = 'User'
                
                return JsonResponse({
                    'message': 'Login successful!',
                    'username': user.username,
                    'role': frontend_role
                }, status=200)
            else:
                return JsonResponse({'error': 'Invalid Username or Password'}, status=401)
                
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Only POST requests allowed'}, status=405)

@csrf_exempt
def book_service(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            customer = User.objects.get(username=data.get('username'))
            category = Category.objects.get(id=data.get('category_id'))
            
            employee_profile = EmployeeProfile.objects.filter(category=category).first()

            if not employee_profile:
                return JsonResponse({'error': f'Sorry! No {category.name} professionals are available.'}, status=400)

            customer.address = data.get('address')
            customer.save()

            # NEW: Save Payment Method and Amount!
            Booking.objects.create(
                customer=customer,
                employee=employee_profile,
                service_date=data.get('date'),
                service_time=data.get('time'),
                payment_method=data.get('payment_method', 'Pay After Service'),
                amount='89.99',
                status='PENDING'
            )
            return JsonResponse({'message': 'Booking successful!'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)

@csrf_exempt
def get_my_schedule(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            role = data.get('role')
            bookings_data = []

            if role == 'Admin':
                for b in Booking.objects.all().order_by('-id'):
                    bookings_data.append({
                        'id': b.id,
                        'customer': b.customer.username,
                        'service': b.employee.category.name if b.employee.category else 'Service',
                        'professional': b.employee.user.username if b.employee else 'Unassigned',
                        'date': b.service_date.strftime('%Y-%m-%d'),
                        'time': b.service_time,
                        'status': b.status,
                        'address': b.customer.address,
                        'payment_method': getattr(b, 'payment_method', 'N/A'),
                        'amount': getattr(b, 'amount', '89.99')
                    })
            else:
                user = User.objects.get(username=username)
                if role == 'User':
                    for b in Booking.objects.filter(customer=user).order_by('-id'):
                        bookings_data.append({
                            'id': b.id,
                            'service': b.employee.category.name if b.employee.category else 'Service',
                            'date': b.service_date.strftime('%Y-%m-%d'),
                            'time': b.service_time,
                            'status': b.status,
                            'professional': b.employee.user.username,
                            'pro_phone': b.employee.user.phone or "Not Provided",
                            'payment_method': getattr(b, 'payment_method', 'N/A')
                        })
                elif role == 'Service Man':
                    profile = EmployeeProfile.objects.filter(user=user).first()
                    if profile:
                        for b in Booking.objects.filter(employee=profile).order_by('-id'):
                            bookings_data.append({
                                'id': b.id,
                                'customer': b.customer.username,
                                'customer_phone': b.customer.phone or "Not Provided",
                                'date': b.service_date.strftime('%Y-%m-%d'),
                                'time': b.service_time,
                                'address': b.customer.address,
                                'status': b.status,
                                'payment_method': getattr(b, 'payment_method', 'N/A')
                            })
            return JsonResponse({'bookings': bookings_data}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)

@csrf_exempt
def update_job_status(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            booking_id = data.get('booking_id')
            new_status = data.get('status')
            
            booking = Booking.objects.get(id=booking_id)
            booking.status = new_status
            booking.save()
            
            return JsonResponse({'message': f'Job marked as {new_status}!'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)