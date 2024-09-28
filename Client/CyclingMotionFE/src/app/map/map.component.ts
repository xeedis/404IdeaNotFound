import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, FormsModule],
  templateUrl: './map.component.html',
  styles: [] // Remove this line if it exists
})
export class MapComponent implements OnInit {
  mapHeight = '100vh';
  mapWidth = '100%';
  center: google.maps.LatLngLiteral = {lat: 50.0647, lng: 19.9450}; // Krakow coordinates
  zoom = 12;
  krakowMarker: google.maps.LatLngLiteral = {lat: 50.0647, lng: 19.9450};

  startPoint: string = '';
  endPoint: string = '';
  routePath: google.maps.LatLngLiteral[] = [];

  selectedRoute: string = '';
  predefinedRoutes = [
    { id: '1', name: 'Krakow City Tour', path: [
      {lat: 50.0647, lng: 19.9450},
      {lat: 50.0619, lng: 19.9368},
      {lat: 50.0541, lng: 19.9360},
      {lat: 50.0547, lng: 19.9450}
    ]},
    { id: '2', name: 'Vistula River Route', path: [
      {lat: 50.0547, lng: 19.9450},
      {lat: 50.0500, lng: 19.9900},
      {lat: 50.0450, lng: 20.0000},
      {lat: 50.0400, lng: 20.0100}
    ]}
  ];

  ngOnInit() {
    // Initialization logic here
  }

  planRoute() {
    // Here you would typically call a route planning service
    // For this example, we'll just create a simple route
    this.routePath = [
      this.center,
      {lat: this.center.lat + 0.01, lng: this.center.lng + 0.01},
      {lat: this.center.lat + 0.02, lng: this.center.lng + 0.02}
    ];
  }

  loadPredefinedRoute() {
    const route = this.predefinedRoutes.find(r => r.id === this.selectedRoute);
    if (route) {
      this.routePath = route.path;
    }
  }
}
