import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Direction {
  lat: number;
  lng: number;
  accidents?: Accident[];
}

export interface Accident {
  id: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface GetRouteRequest {
  startLocation: Direction;
  endLocation: Direction;
}

@Injectable({
  providedIn: 'root'
})
export class RouteApiService {
  private apiUrl = 'http://localhost:5063/api/Direction'; // Replace with your actual API base URL

  constructor(private http: HttpClient) { }

  getRoutePoints(request: GetRouteRequest): Observable<Direction[]> {
    return this.http.post<Direction[]>(this.apiUrl, request);
  }
}