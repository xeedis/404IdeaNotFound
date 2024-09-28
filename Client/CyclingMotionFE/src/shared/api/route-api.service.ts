import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface RoutePoint {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class RouteApiService {
  constructor() { }

  getRoutePoints(start: string, end: string): Observable<RoutePoint[]> {
    // Mock data for testing
    const mockRoutePoints: RoutePoint[] = [
      { lat: 50.0647, lng: 19.9450 },
      { lat: 50.0646, lng: 19.9460 },
      { lat: 50.0645, lng: 19.9470 },
      { lat: 50.0644, lng: 19.9480 },
      { lat: 50.0643, lng: 19.9490 },
      { lat: 50.0642, lng: 19.9500 },
      { lat: 50.0641, lng: 19.9510 },
      { lat: 50.0640, lng: 19.9520 },
      { lat: 50.0639, lng: 19.9530 },
      { lat: 50.0638, lng: 19.9540 },
    ];

    // Simulating an API call
    return of(mockRoutePoints);
  }
}
