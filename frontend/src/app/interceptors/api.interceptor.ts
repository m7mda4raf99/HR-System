import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService,
    private cookieService: CookieService,
    private router: Router,
    private snipper: NgxSpinnerService,
  ) { }

  private handleAuthError(request: HttpRequest<unknown>, next: HttpHandler, err: HttpErrorResponse): Observable<any> {

    //handle your auth error or rethrow
    if (err.status === 401) {

      this.notificationService.showInfoToast('Please login again to continue')

      this.snipper.hide()

      this.cookieService.deleteAll('/')

      this.router.navigateByUrl(`/login`);

    } else {
      this.snipper.hide()

      this.notificationService.showErrorToast(err.error.error || err.error.email)
    }
    return next.handle(request)
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.cookieService.get('token') != "") {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Authorization': 'Token ' + this.cookieService.get('token')
        }
      })
    } else {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
        },

      });
    }

    next.handle(request)
    return next.handle(request).pipe(catchError(x => this.handleAuthError(request, next, x)));
  }
}
