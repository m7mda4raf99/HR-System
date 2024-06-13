import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';

interface Employee {
  id: number;
  name: string;
  email: string;
  group: string;
  editMode: boolean;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent {
  employees: Employee[] = [];
  newEmployeeForm: FormGroup;

  constructor(private apiService: ApiService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private cookieService: CookieService) {

    this.newEmployeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      group: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.getEmployees();
  }

  async getEmployees() {
    this.spinnerService.show();
    const response: any = await this.apiService.getEmployees();
    this.spinnerService.hide();

    if (response && response.employees) {
      this.employees = response.employees.map((employee: Employee) => ({
        ...employee,
        editMode: false
      }));
    }

  }

  viewAttendance(employee: any): void {
    this.router.navigate(['/employee-attendance', employee.id]);
  }

  toggleEditMode(employee: Employee): void {
    employee.editMode = !employee.editMode;
  }

  async editEmployee(employee: Employee) {
    this.spinnerService.show();
    const response: any = await this.apiService.editEmployee(employee.id, employee);
    this.spinnerService.hide();

    if (response) {
      this.notificationService.showSuccessToast('Employee ' + employee.id + ' updated successfully');
      employee.editMode = false;
    }
  }

  async addEmployee(): Promise<void> {
    if (this.newEmployeeForm.valid) {
      const newEmployee = this.newEmployeeForm.value;

      this.spinnerService.show();
      const response: any = await this.apiService.addEmployee(newEmployee);
      this.spinnerService.hide();

      if (response) {
        this.employees.push(response);
        this.newEmployeeForm.reset(); // Reset the form after successful submission
      }

    } else {
      this.notificationService.showErrorToast('Please fill in all fields correctly.');
    }
  }

  logout(): void {
    this.cookieService.delete('token', '/');
    this.cookieService.deleteAll('/')
    this.router.navigate(['/login']);
  }
}
