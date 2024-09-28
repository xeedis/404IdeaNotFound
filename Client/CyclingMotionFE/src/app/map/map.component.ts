import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone } from '@angular/core';
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
  @ViewChild('startPointInput') startPointInput!: ElementRef;
  @ViewChild('endPointInput') endPointInput!: ElementRef;

  mapHeight = '100vh';
  mapWidth = '100%';
  center: google.maps.LatLngLiteral = {lat: 50.0647, lng: 19.9450}; // Krakow coordinates
  zoom = 12;
  krakowMarker: google.maps.LatLngLiteral = {lat: 50.0647, lng: 19.9450};

  routeForm: FormGroup;
  routePath: google.maps.LatLngLiteral[] = [];
  polylinePath: google.maps.Polyline | null = null;

  startPointAutocomplete: google.maps.places.Autocomplete | null = null;
  endPointAutocomplete: google.maps.places.Autocomplete | null = null;

  predefinedRoutes = [
    { id: '1', name: 'Krakow City Tour', start: 'Wawel Castle, Krakow', end: 'Main Market Square, Krakow' },
    { id: '2', name: 'Vistula River Route', start: 'Wawel Castle, Krakow', end: 'Tyniec Abbey, Krakow' }
  ];

  constructor(
    private fb: FormBuilder,
    private routeApiService: RouteApiService,
    private ngZone: NgZone
  ) {
    this.routeForm = this.fb.group({
      startPoint: [''],
      endPoint: [''],
      selectedRoute: ['']
    });
  }

  ngOnInit() {
    this.getCurrentLocation();
  }

  ngAfterViewInit() {
    this.initAutocomplete();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          if (this.map.googleMap) {
            this.map.googleMap.setCenter(this.center);
            this.map.googleMap.setZoom(12);
          }
        },
        (error) => {
          console.warn('Error getting current location:', error.message);
          this.useDefaultLocation();
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      this.useDefaultLocation();
    }
  }

  useDefaultLocation() {
    // Use a default location (e.g., Krakow) if geolocation fails
    this.center = {lat: 50.0647, lng: 19.9450};
    if (this.map.googleMap) {
      this.map.googleMap.setCenter(this.center);
      this.map.googleMap.setZoom(12);
    }
  }

  initAutocomplete() {
    this.startPointAutocomplete = new google.maps.places.Autocomplete(
      this.startPointInput.nativeElement,
      { types: ['geocode'] }
    );
    this.endPointAutocomplete = new google.maps.places.Autocomplete(
      this.endPointInput.nativeElement,
      { types: ['geocode'] }
    );

    this.startPointAutocomplete.addListener('place_changed', () => this.onPlaceChanged('start'));
    this.endPointAutocomplete.addListener('place_changed', () => this.onPlaceChanged('end'));
  }

  onPlaceChanged(type: 'start' | 'end') {
    const autocomplete = type === 'start' ? this.startPointAutocomplete : this.endPointAutocomplete;
    const place = autocomplete?.getPlace();

    if (place?.geometry?.location) {
      this.ngZone.run(() => {
        this.routeForm.patchValue({
          [type === 'start' ? 'startPoint' : 'endPoint']: place.formatted_address
        });
      });
    }
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