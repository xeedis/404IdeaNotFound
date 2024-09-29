import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import {ApiException} from "../apiErrors/api-error.service";
export interface ApiErrorDetail {
  code: string;
  message: string;
  values?: { [key: string]: any };
}
@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandlerService {
  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  handleError(error: HttpErrorResponse | ApiException): Observable<never> {
    console.error('API Error:', error);

    let errorMessage: string;

    if (error instanceof ApiException) {
      errorMessage = this.getErrorMessageFromApiException(error);
    } else {
      const errorDetails = this.parseErrorResponse(error);
      errorMessage = this.getErrorMessage(error, errorDetails);
    }

    console.log(errorMessage);

    this.notificationService.showApiError(errorMessage);

    return throwError(() => new Error(errorMessage));
  }

  private getErrorMessageFromApiException(error: ApiException): string {
    return this.getErrorMessage(
      { status: error.status } as HttpErrorResponse,
      [{
        code: error.code,
        message: error.message,
        values: error.values
      }]
    );
  }

  // ... reszta metod pozostaje bez zmian
  private parseErrorResponse(error: HttpErrorResponse): ApiErrorDetail[] {
    const errorDetails: ApiErrorDetail[] = [];

    if (error.error && error.error.errors && Array.isArray(error.error.errors)) {
      for (const specificError of error.error.errors) {
        errorDetails.push({
          code: specificError.code,
          message: specificError.message,
          values: specificError.values
        });
      }
    } else if (error.error) {
      errorDetails.push({
        code: error.status.toString(),
        message: error.error.message || 'Unknown error occurred',
        values: error.error.values
      });
    } else {
      errorDetails.push({
        code: error.status.toString(),
        message: error.message || 'Unknown error occurred'
      });
    }

    return errorDetails;
  }
  private getErrorMessage(error: HttpErrorResponse, errorDetails: ApiErrorDetail[]): string {
    if (error.error instanceof ErrorEvent) {
      console.log('error.error instanceof ErrorEvent', errorDetails);
      return this.translate.instant('general.clientError');
    } else {
      const errorDetail = errorDetails[0];
      let message = '';

      switch (error.status) {
        case 400:
          message = this.translate.instant(`generalError.${errorDetail.code}`, errorDetail.values);
          break;
        case 401:
          message = `${this.translate.instant('generalError.unauthorized')} ApiResponse: ${errorDetail.message}`;
          break;
        case 403:
          message = this.translate.instant(`generalError.${errorDetail.code}`, errorDetail.values);
          break;
        case 404:
          message = `${this.translate.instant('generalError.notFound')} ApiResponse: ${errorDetail.message}`;
          break;
        case 500:
          message = `${this.translate.instant('generalError.serverError')} ApiResponse: ${errorDetail.message}`;
          break;
        default:
          message = `${this.translate.instant('generalError.youAreNotLoggedIn')}`;
      }

      if (errorDetail.values) {
        console.log('Additional error details:', errorDetail.values);
      }

      return message;
    }
  }
}
