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
      { lat: 37.782, lng: -122.447 },
      { lat: 37.782, lng: -122.445 },
      { lat: 37.782, lng: -122.443 },
      { lat: 37.782, lng: -122.441 },
      { lat: 37.782, lng: -122.439 },
      { lat: 37.782, lng: -122.437 },
      { lat: 37.782, lng: -122.435 },
      { lat: 37.785, lng: -122.447 },
      { lat: 37.785, lng: -122.445 },
      { lat: 37.785, lng: -122.443 },
      { lat: 37.785, lng: -122.441 },
      { lat: 37.785, lng: -122.439 },
      { lat: 37.785, lng: -122.437 },
      { lat: 37.785, lng: -122.435 },
    ];

    // Simulating an API call
    return of(mockRoutePoints);
  }
}
// var heatmapData = [
//   new google.maps.LatLng(37.782, -122.447),
//   new google.maps.LatLng(37.782, -122.445),
//   new google.maps.LatLng(37.782, -122.443),
//   new google.maps.LatLng(37.782, -122.441),
//   new google.maps.LatLng(37.782, -122.439),
//   new google.maps.LatLng(37.782, -122.437),
//   new google.maps.LatLng(37.782, -122.435),
//   new google.maps.LatLng(37.785, -122.447),
//   new google.maps.LatLng(37.785, -122.445),
//   new google.maps.LatLng(37.785, -122.443),
//   new google.maps.LatLng(37.785, -122.441),
//   new google.maps.LatLng(37.785, -122.439),
//   new google.maps.LatLng(37.785, -122.437),
//   new google.maps.LatLng(37.785, -122.435)
// ];
