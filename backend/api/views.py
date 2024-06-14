from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from hr_system.models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer

from datetime import datetime
from django.utils import timezone
import bcrypt

from django.contrib.auth import get_user_model
User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        employee = Employee.objects.get(email=email)

        # Make sure that the employee belongs to the HR group
        if employee.group != 'HR':
            return Response({'error': 'You are not allowed to login. You are not an HR Employee'}, status=status.HTTP_400_BAD_REQUEST)

        stored_hashed_password = employee.password.encode('utf-8')

        # Verify the provided password against the stored hashed password
        if bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password):
            # Update the last_login field
            employee.last_login = timezone.now()
            employee.save(update_fields=['last_login'])
            
            # Generate or retrieve the token for the authenticated employee
            token, created = Token.objects.get_or_create(user=employee)
            return Response({'message': 'Logged in successfully!', 'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials!'}, status=status.HTTP_400_BAD_REQUEST)
        
    except Employee.DoesNotExist:
        # The email does not correspond to any employee in the database
        return Response({'error': 'Email is incorrect.' }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employees(_):
    # Retrieve all Employees from the database, serialize and return them
    employees = Employee.objects.all()

    serializer = EmployeeSerializer(employees, many=True)

    return Response({'employees': serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_employee(request):

    serializer = EmployeeSerializer(data=request.data)

    if serializer.is_valid():
        
        plain_password = request.data.get('password')
        
        # Hash the plain password using bcrypt
        hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
        
        # Replace the plain password with the hashed one
        serializer.validated_data['password'] = hashed_password.decode('utf-8')
        
        # Save the employee
        employee = Employee(**serializer.validated_data)
        employee.save()

        return Response(EmployeeSerializer(employee).data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_employee(request, pk):
    # Check if the employee exists
    try:
        employee = Employee.objects.get(pk=pk)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = EmployeeSerializer(employee, data=request.data, partial=True)
    
    if serializer.is_valid():
        # Check if password is being updated
        if 'password' in serializer.validated_data:
            plain_password = serializer.validated_data.get('password')
            hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
            serializer.validated_data['password'] = hashed_password.decode('utf-8')
        
        # Save the employee
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employee_attendances(_, pk):
    # Check if the employee exists
    try:
        employee = Employee.objects.get(pk=pk)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Retrieve all attendance records for the employee
    attendances = Attendance.objects.filter(employee=employee)
    
    # Serialize the attendance records
    serializer = AttendanceSerializer(attendances, many=True)
    
    # Return the serialized data
    return Response({'attendances': serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_attendance(request):
    # Extract data from request
    employee_id = request.data.get('id')
    date_str = request.data.get('date')

    # Validate data
    if not employee_id or not date_str:
        return Response({'error': 'Employee ID and date are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if employee exists
    try:
        employee = Employee.objects.get(id=employee_id)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Create attendance record
    attendance_data = {
        'employee': employee.id,
        'date': date
    }

    serializer = AttendanceSerializer(data=attendance_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)