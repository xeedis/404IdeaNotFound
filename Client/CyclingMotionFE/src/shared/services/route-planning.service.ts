import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RouteApiService, Direction, GetRouteRequest, RouteResponse } from '../../shared/api/route-api.service';

@Injectable({
  providedIn: 'root'
})
export class RoutePlanningService {
  constructor(private routeApiService: RouteApiService) {}

  planRoute(startPoint: Direction, endPoint: Direction): Observable<RouteResponse> {
    const request: GetRouteRequest = {
      startLocation: startPoint,
      endLocation: endPoint
    };
    return this.routeApiService.getRoutePoints(request);
  }

  addMarker(map: google.maps.Map, location: Direction, label: 'Start' | 'End'): void {
    new google.maps.Marker({
      position: location,
      map: map,
      label: label,
    });
  }

  drawRoute(map: google.maps.Map, points: Direction[]): google.maps.Polyline {
    const polyline = new google.maps.Polyline({
      path: points,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 5,
      clickable: true
    });
    polyline.setMap(map);

    // Adjust map bounds to fit the route
    const bounds = new google.maps.LatLngBounds();
    points.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);

    return polyline;
  }
}
