import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Direction } from '../../shared/api/route-api.service';
import { RoutePlanningService } from '../../shared/services/route-planning.service';
import { DarkModeService } from '../../shared/services/dark-mode.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BrdDto } from '../../shared/api/route-api.service';
import { GetRouteRequest } from '../../shared/api/route-api.service';
import { RouteApiService } from '../../shared/api/route-api.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './map.component.html',
  styles: []
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild('startPointInput') startPointInput!: ElementRef;
  @ViewChild('endPointInput') endPointInput!: ElementRef;

  mapHeight = '100vh';
  mapWidth = '100%';
  center: google.maps.LatLngLiteral = {lat: 50.0647, lng: 19.9450}; // Krakow coordinates
  zoom = 12;

  routeForm: FormGroup;
  polylinePath: google.maps.Polyline | null = null;

  startPointAutocomplete: google.maps.places.Autocomplete | null = null;
  endPointAutocomplete: google.maps.places.Autocomplete | null = null;

  trafficLayer: google.maps.TrafficLayer | null = null;


  private destroy$ = new Subject<void>();
  mapStyles: google.maps.MapTypeStyle[] = [];

  startLocation: Direction | null = null;
  endLocation: Direction | null = null;

  accidents: BrdDto[] = [];
  showAccidents: boolean = false;
  accidentMarkers: google.maps.Marker[] = [];

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private routePlanningService: RoutePlanningService,
    private darkModeService: DarkModeService,
    private routeApiService: RouteApiService
  ) {
    this.routeForm = this.fb.group({
      startPoint: [''],
      endPoint: [''],
      selectedRoute: ['']
    });
  }

  ngOnInit() {
    this.getCurrentLocation();
    this.darkModeService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDarkMode => {
        this.setMapStyles(isDarkMode);
      });
  }

  ngAfterViewInit() {
    this.initAutocomplete();
  }
  ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
toggleAccidents() {
  this.showAccidents = !this.showAccidents;
  if (this.showAccidents && this.startLocation && this.endLocation) {
    this.fetchAndDisplayAccidents();
  } else {
    this.clearAccidentMarkers();
  }
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
            this.map.googleMap.setZoom(15);
            this.addCurrentLocationMarker(this.center);
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
    const options = {
      types: ['address'],
      componentRestrictions: { country: 'pl' }, // Restrict to Poland
      fields: ['address_components', 'geometry', 'name', 'formatted_address'],
    };

    this.startPointAutocomplete = new google.maps.places.Autocomplete(
      this.startPointInput.nativeElement,
      options
    );
    this.endPointAutocomplete = new google.maps.places.Autocomplete(
      this.endPointInput.nativeElement,
      options
    );

    this.startPointAutocomplete.addListener('place_changed', () => this.onPlaceChanged('start'));
    this.endPointAutocomplete.addListener('place_changed', () => this.onPlaceChanged('end'));

    // Bias the autocomplete results towards the user's current location
    if (this.map.googleMap) {
      this.startPointAutocomplete.bindTo('bounds', this.map.googleMap);
      this.endPointAutocomplete.bindTo('bounds', this.map.googleMap);
    }
  }

  onPlaceChanged(type: 'start' | 'end') {
    const autocomplete = type === 'start' ? this.startPointAutocomplete : this.endPointAutocomplete;
    const place = autocomplete?.getPlace();

    if (place?.geometry?.location) {
      const location: Direction = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      this.ngZone.run(() => {
        this.routeForm.patchValue({
          [type === 'start' ? 'startPoint' : 'endPoint']: place.formatted_address || place.name
        });
        // Store the location object in a separate property
        this[type === 'start' ? 'startLocation' : 'endLocation'] = location;
        if (type === 'start') {
          this.map.googleMap?.setCenter(location);
          this.map.googleMap?.setZoom(15);
        }
      });
    }
  }

  planRoute() {
    const startPoint = this.startLocation;
    const endPoint = this.endLocation;

    if (startPoint && endPoint && this.map.googleMap) {
      this.routePlanningService.addMarker(this.map.googleMap, startPoint, 'Start');
      this.routePlanningService.addMarker(this.map.googleMap, endPoint, 'End');
      this.routePlanningService.planRoute(startPoint, endPoint).subscribe({
        next: (points: Direction[]) => {
          if (this.polylinePath) {
            this.polylinePath.setMap(null);
          }
          this.polylinePath = this.routePlanningService.drawRoute(this.map.googleMap!, points);
          this.toggleTrafficLayer();
          this.clearAccidentMarkers();
          if (this.showAccidents) {
            this.fetchAndDisplayAccidents();
          }
        },
        error: (error) => {
          console.error('Error fetching route points:', error);
        }
      });
    }
  }
  
  private getDirectionFromInput(controlName: 'startPoint' | 'endPoint'): Direction | null {
    const input = this.routeForm.get(controlName)?.value;
    if (typeof input === 'string') {
      // If it's a string (address), we need to geocode it
      return this.geocodeAddress(input);
    } else if (input && typeof input === 'object' && 'lat' in input && 'lng' in input) {
      // If it's already a Direction object, return it
      return input as Direction;
    }
    return null;
  }
  
  private geocodeAddress(address: string): Direction | null {
    // This is a synchronous method, but in a real application, you'd want to use
    // Google's Geocoding service asynchronously. For now, we'll return null.
    console.warn('Geocoding not implemented. Address:', address);
    return null;
  }

  // loadPredefinedRoute() {
  //   const selectedRouteId = this.routeForm.get('selectedRoute')?.value;
  //   const route = this.predefinedRoutes.find(r => r.id === selectedRouteId);
  //   if (route && this.map.googleMap) {
  //     this.routeForm.patchValue({
  //       startPoint: route.start,
  //       endPoint: route.end
  //     });
  //     this.routePlanningService.addMarker(this.map.googleMap, route.start as unknown as Direction, 'Start');
  //     this.routePlanningService.addMarker(this.map.googleMap, route.end as unknown as Direction, 'End');
  //     this.planRoute();
  //   }
  // }

  toggleTrafficLayer() {
    if (this.trafficLayer) {
      this.trafficLayer.setMap(null);
      this.trafficLayer = null;
    } else {
      this.trafficLayer = new google.maps.TrafficLayer();
      this.trafficLayer.setMap(this.map.googleMap!);
    }
  }

  addCurrentLocationMarker(position: google.maps.LatLngLiteral) {
    if (this.map.googleMap) {
      new google.maps.Marker({
        position: position,
        map: this.map.googleMap,
        title: 'Your Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2,
        }
      });
    }
  }

  setMapStyles(isDarkMode: boolean) {
    this.mapStyles = isDarkMode ? [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
      }
    ] : [];

    if (this.map && this.map.googleMap) {
      this.map.googleMap.setOptions({ styles: this.mapStyles });
    }
  }

  private fetchAndDisplayAccidents() {
    if (this.startLocation && this.endLocation) {
      const request: GetRouteRequest = {
        startLocation: this.startLocation,
        endLocation: this.endLocation
      };
      this.routeApiService.getAccidents(request).subscribe({
        next: (accidents: BrdDto[]) => {
          this.accidents = accidents;
          this.displayAccidents();
        },
        error: (error) => {
          console.error('Error fetching accidents:', error);
        }
      });
    }
  }

  private displayAccidents() {
    this.clearAccidentMarkers();
    if (this.map && this.map.googleMap) {
      this.accidents.forEach(accident => {
        const marker = new google.maps.Marker({
          position: { lat: accident.lat, lng: accident.lng },
          map: this.map.googleMap,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#FF0000",
            fillOpacity: 0.7,
            strokeWeight: 0
          }
        });
        this.accidentMarkers.push(marker);
      });
    } else {
      console.error('Google Map is not initialized');
    }
  }

  private clearAccidentMarkers() {
    this.accidentMarkers.forEach(marker => marker.setMap(null));
    this.accidentMarkers = [];
  }

}