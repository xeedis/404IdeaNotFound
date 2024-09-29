import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {ApiErrorHandlerService} from "../services/api-error-handler.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ApiErrorHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);
      return errorHandler.handleError(error);
    })
  );
};
