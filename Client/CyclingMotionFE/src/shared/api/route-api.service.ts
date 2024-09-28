import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface RoutePoint {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class RouteApiService {
  constructor(private http: HttpClient) { }

  getRoutePoints(start: string, end: string): Observable<RoutePoint[]> {
    // Replace 'assets/route-data.json' with the actual path to your JSON file
    return this.http.get<RoutePoint[]>('assets/response.json').pipe(
      map(data => data.map(point => ({
        lat: point.lat,
        lng: point.lng
      })))
    );
  }
}

