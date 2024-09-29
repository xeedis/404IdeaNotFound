import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface Direction {
  lat: number;
  lng: number;
}

export interface BrdDto {
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

  getAccidents(request: GetRouteRequest): Observable<BrdDto[]> {
    let params = new HttpParams()
      .set('StartPoint.Lat', request.startLocation.lat.toString())
      .set('StartPoint.Lng', request.startLocation.lng.toString())
      .set('EndPoint.Lat', request.endLocation.lat.toString())
      .set('EndPoint.Lng', request.endLocation.lng.toString());

    return this.http.get<BrdDto[]>(`${this.apiUrl}/Accidents`, { params });
  }
}

