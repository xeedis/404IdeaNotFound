import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RouteApiService, RoutePoint } from '../../shared/api/route-api.service';

@Injectable({
  providedIn: 'root'
})
export class RoutePlanningService {
  constructor(private routeApiService: RouteApiService) {}

  planRoute(startPoint: string, endPoint: string): Observable<RoutePoint[]> {
    return this.routeApiService.getRoutePoints(startPoint, endPoint);
  }

  addMarker(map: google.maps.Map, address: string, label: 'Start' | 'End'): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const position = results[0].geometry.location;
        new google.maps.Marker({
          position: position,
          map: map,
          label: label,
        });
      }
    });
  }

  drawRoute(map: google.maps.Map, points: RoutePoint[]): google.maps.Polyline {
    const polyline = new google.maps.Polyline({
      path: points,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    polyline.setMap(map);

    // Adjust map bounds to fit the route
    const bounds = new google.maps.LatLngBounds();
    points.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);

    return polyline;
  }
}