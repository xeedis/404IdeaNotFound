import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface RoutePoint {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class RouteApiService {
  private apiUrl = 'http://localhost:5063/api/Direction'; // Replace with your actual API base URL

  constructor(private http: HttpClient) { }

  getRoutePoints(start: string, end: string): Observable<RoutePoint[]> {
    let params = new HttpParams()
      .set('Origin', start)
      .set('Destination', end);

    return this.http.get<RoutePoint[]>(this.apiUrl, { params });
  }
}

