import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {
  employeeId: number;
  attendances: any[] = [];
  newAttendanceDate: string;

  constructor(private route: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private notificationService: NotificationService,
    private router: Router) {
    this.employeeId = this.route.snapshot.params['id'];
    this.newAttendanceDate = '';
  }

  ngOnInit(): void {
    this.loadAttendance();
  }

  async loadAttendance(): Promise<void> {
    this.spinner.show();
    const response = await this.apiService.getEmployeeAttendances(this.employeeId);
    this.spinner.hide();

    if (response && response.attendances) {
      this.attendances = response.attendances;
    }

  }

  async addAttendance(): Promise<void> {
    if (!this.newAttendanceDate) {
      this.notificationService.showErrorToast('Please select a date.');
      return;
    }

    const data = { id: this.employeeId, date: this.newAttendanceDate };

    this.spinner.show();
    const response = await this.apiService.addAttendance(data);
    this.spinner.hide();

    if (response) {
      this.attendances.push(response);
      this.newAttendanceDate = '';
      this.notificationService.showSuccessToast('Attendance added successfully.');
    }

  }

  back() {
    this.router.navigate(['/employees'])
  }
}
