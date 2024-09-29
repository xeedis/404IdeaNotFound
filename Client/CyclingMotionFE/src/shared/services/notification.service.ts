import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  showSuccess(messageKey: string): void {
    this.translate.get(messageKey).subscribe((translation: string) => {
      this.snackBar.open(translation, this.translate.instant('generalButton.close'), {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });
  }
  showInfo(error: string | HttpErrorResponse): void {
    let errorMessageKey = 'generalError.error';
    if (typeof error === 'string') {
      errorMessageKey = error;
    }

    this.translate.get(errorMessageKey).subscribe((translation: string) => {
      this.snackBar.open(translation, this.translate.instant('generalButton.close'), {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    });
  }


  showApiError(error: string | HttpErrorResponse): void {
    let errorMessageKey = 'general.error';

    if (typeof error === 'string') {
      console.log(error);
      errorMessageKey = error;
    } else {
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessageKey = 'generalError.clientError';
      } else {
        // Backend returned unsuccessful response code
        switch (error.status) {
          case 400:
            errorMessageKey = 'generalError.badRequest';
            break;
          case 401:
            errorMessageKey = 'generalError.unauthorized';
            break;
          case 403:
            errorMessageKey = 'generalError.forbidden';
            break;
          case 404:
            errorMessageKey = 'generalError.notFound';
            break;
          case 500:
            errorMessageKey = 'generalError.serverError';
            break;
          default:
            errorMessageKey = 'generalError.unknownError';
        }
        console.error('Server error:', error);
      }
    }

    console.log(errorMessageKey);

    this.translate.get(errorMessageKey).subscribe((translation: string) => {
      this.snackBar.open(translation, this.translate.instant('generalButton.close'), {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    });
  }
}
