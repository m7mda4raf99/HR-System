import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private notificationService: NotificationService,
    private spinnerService: NgxSpinnerService) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  async login() {
    if (this.loginForm!.valid) {

      const data = {
        email: this.loginForm!.get('email')!.value,
        password: this.loginForm!.get('password')!.value
      }

      this.spinnerService.show();
      const response: any = await this.apiService.login(data);
      this.spinnerService.hide();

      if (response && response.token) {
        this.cookieService.set('token', response.token, { sameSite: 'Lax', secure: true });
        this.router.navigate(['/employees']);
      }

    } else {
      this.notificationService.showErrorToast('Please fill in the form correctly.');
    }

  }
}
