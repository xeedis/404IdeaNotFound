import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface Direction {
  lat: number;
  lng: number;
}

export interface Accident {
  id: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  lat: number;
  lng: number;
}

export interface GetRouteRequest {
  startLocation: Direction;
  endLocation: Direction;
}

@Injectable({
  providedIn: 'root'
})
export class RouteApiService {
  private apiUrl = 'http://localhost:5063/api'; // Base URL

  constructor(private http: HttpClient) { }

  getRoutePoints(request: GetRouteRequest): Observable<Direction[]> {
    return this.http.post<Direction[]>(`${this.apiUrl}/Direction`, request);
  }

  getAccidents(startPoint: Direction, endPoint: Direction): Observable<Accident[]> {
    let params = new HttpParams()
      .set('StartPoint.Lat', startPoint.lat.toString())
      .set('StartPoint.Lng', startPoint.lng.toString())
      .set('EndPoint.Lat', endPoint.lat.toString())
      .set('EndPoint.Lng', endPoint.lng.toString());

    return this.http.get<Accident[]>(`${this.apiUrl}/Accidents`, { params });
  }
}