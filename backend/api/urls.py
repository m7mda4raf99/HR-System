from django.urls import path
from . import views

urlpatterns = [    
    path('login', views.login, name='login'),

    path('get-employees', views.get_employees),
    
    path('add-employee', views.add_employee, name='add-employee'),
    path('edit-employee/<int:pk>', views.edit_employee, name='edit-employee'),

    path('get-employee-attendances/<int:pk>', views.get_employee_attendances, name='get-employee-attendances'),
    path('add-attendance', views.add_attendance, name='add-attendance'),

]