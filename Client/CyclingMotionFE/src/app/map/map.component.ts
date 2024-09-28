import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, FormsModule],
  templateUrl: './map.component.html',
  styles: [] // Remove this line if it exists
})
export class MapComponent implements OnInit {
  @ViewChild(GoogleMapsModule) map!: google.maps.Map;

  mapHeight = '100vh';
  mapWidth = '100%';
  center: google.maps.LatLngLiteral = {lat: 50.0647, lng: 19.9450}; // Krakow coordinates
  zoom = 12;
  krakowMarker: google.maps.LatLngLiteral = {lat: 50.0647, lng: 19.9450};

  startPoint: string = '';
  endPoint: string = '';
  routePath: google.maps.LatLngLiteral[] = [];
  directionsResults$: Observable<google.maps.DirectionsResult|undefined> | undefined;

  selectedRoute: string = '';
  predefinedRoutes = [
    { id: '1', name: 'Krakow City Tour', start: 'Wawel Castle, Krakow', end: 'Main Market Square, Krakow' },
    { id: '2', name: 'Vistula River Route', start: 'Wawel Castle, Krakow', end: 'Tyniec Abbey, Krakow' }
  ];

  constructor(private mapDirectionsService: MapDirectionsService) {}

  ngOnInit() {
    // Initialization logic here
  }

  planRoute() {
    if (this.startPoint && this.endPoint) {
      const request: google.maps.DirectionsRequest = {
        origin: this.startPoint,
        destination: this.endPoint,
        travelMode: google.maps.TravelMode.BICYCLING
      };

      this.directionsResults$ = this.mapDirectionsService.route(request).pipe(
        map(response => response.result)
      );
    }
  }

  loadPredefinedRoute() {
    const route = this.predefinedRoutes.find(r => r.id === this.selectedRoute);
    if (route) {
      this.startPoint = route.start;
      this.endPoint = route.end;
      this.planRoute();
    }
  }
}
