import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { RouteApiService, RoutePoint } from '../../shared/api/route-api.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './map.component.html',
  styles: [] // Remove this line if it exists
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;

  mapHeight = '100vh';
  mapWidth = '100%';
  center: google.maps.LatLngLiteral = {lat: 50.0647, lng: 19.9450}; // Krakow coordinates
  zoom = 12;
  krakowMarker: google.maps.LatLngLiteral = {lat: 50.0647, lng: 19.9450};

  routeForm: FormGroup;
  routePath: google.maps.LatLngLiteral[] = [];
  polylinePath: google.maps.Polyline | null = null;

  predefinedRoutes = [
    { id: '1', name: 'Krakow City Tour', start: 'Wawel Castle, Krakow', end: 'Main Market Square, Krakow' },
    { id: '2', name: 'Vistula River Route', start: 'Wawel Castle, Krakow', end: 'Tyniec Abbey, Krakow' }
  ];

  constructor(
    private fb: FormBuilder,
    private routeApiService: RouteApiService
  ) {
    this.routeForm = this.fb.group({
      startPoint: [''],
      endPoint: [''],
      selectedRoute: ['']
    });
  }

  ngOnInit() {
    // Initialization logic here
  }

  ngAfterViewInit() {
    // The map is now initialized
  }

  planRoute() {
    const { startPoint, endPoint } = this.routeForm.value;
    if (startPoint && endPoint) {
      this.routeApiService.getRoutePoints(startPoint, endPoint).subscribe(
        (points: RoutePoint[]) => {
          this.drawRoute(points);
        },
        (error) => {
          console.error('Error fetching route points:', error);
        }
      );
    }
  }

  drawRoute(points: RoutePoint[]) {
    if (!this.map || !this.map.googleMap) {
      console.error('Google Map not initialized');
      return;
    }

    if (this.polylinePath) {
      this.polylinePath.setMap(null);
    }

    this.polylinePath = new google.maps.Polyline({
      path: points,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    this.polylinePath.setMap(this.map.googleMap);

    // Adjust map bounds to fit the route
    const bounds = new google.maps.LatLngBounds();
    points.forEach((point) => bounds.extend(point));
    this.map.googleMap.fitBounds(bounds);
  }

  loadPredefinedRoute() {
    const selectedRouteId = this.routeForm.get('selectedRoute')?.value;
    const route = this.predefinedRoutes.find(r => r.id === selectedRouteId);
    if (route) {
      this.routeForm.patchValue({
        startPoint: route.start,
        endPoint: route.end
      });
      this.planRoute();
    }
  }
}
