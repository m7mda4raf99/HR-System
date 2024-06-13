import { Injectable } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard'


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastService: ToastService) { }

  showSuccessToast(message: string) {
    const options = { progressBar: true, closeButton: true, tapToDismiss: true, titleClass: 'yellow' }
    this.toastService.success(message, 'Success!', options)
  }
  showErrorToast(message: string) {
    const options = { enableHtml: false, positionClass: 'md-toast-top-right' }
    this.toastService.error(message, 'Error!', options)
  }

  showInfoToast(message: string) {
    const options = { progressBar: true, closeButton: true, tapToDismiss: true, extendedTimeOut: 30000, messageClass: 'pink' }
    this.toastService.info(message, 'Info!', options)
  }

  showWarningToast(message: string) {
    const options = { progressBar: true, timeOut: 3000, toastClass: 'black' }
    this.toastService.warning(message, 'Warning!', options)
  }
}
