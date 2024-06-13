from rest_framework import serializers
from hr_system.models import Employee, Attendance

class EmployeeSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Employee
        fields = ['id', 'name', 'email', 'group']

    def validate_email(self, value):
        if self.instance and self.instance.email == value:
            return value
        if Employee.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'