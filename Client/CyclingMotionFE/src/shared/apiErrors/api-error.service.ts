import {mergeMap as _observableMergeMap, catchError as _observableCatch} from 'rxjs/operators';
import {Observable, throwError as _observableThrow, of as _observableOf} from 'rxjs';
import {Injectable, Inject, Optional, InjectionToken} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse, HttpResponseBase, HttpContext} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiException extends Error {
  override message: string;
  status: number;
  response: string;
  headers: { [key: string]: any; };
  result: any;
  code: string;
  values?: { [key: string]: any };

  constructor(
    @Inject('MESSAGE') message: string,
    @Inject('STATUS') status: number,
    @Inject('RESPONSE') response: string,
    @Inject('HEADERS') headers: { [key: string]: any; },
    @Inject('RESULT') result: any,
    @Inject('CODE') code: string,
    @Inject('VALUES') values?: { [key: string]: any }
  ) {
    super();

    this.message = message;
    this.status = status;
    this.response = response;
    this.headers = headers;
    this.result = result;
    this.code = code;
    this.values = values;
  }

  protected isApiException = true;

  static isApiException(obj: any): obj is ApiException {
    return obj.isApiException === true;
  }
}

export function throwException(message: string, status: number, response: string, headers: {
  [key: string]: any;
}, result?: any): Observable<any> {
  if (result !== null && result !== undefined)
    return _observableThrow(result);
  else
    return _observableThrow(new ApiException(message, status, response, headers, '', ''));
}

export function blobToText(blob: any): Observable<string> {
  return new Observable<string>((observer: any) => {
    if (!blob) {
      observer.next("");
      observer.complete();
    } else {
      let reader = new FileReader();
      reader.onload = event => {
        observer.next((event.target as any).result);
        observer.complete();
      };
      reader.readAsText(blob);
    }
  });
}
