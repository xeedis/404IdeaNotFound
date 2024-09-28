import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavigationComponent} from "./navigation/navigation.component";
import {HeaderComponent} from "./header/header.component";
import { MapComponent } from "./map/map.component";
import { DarkModeService } from '../shared/services/dark-mode.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, HeaderComponent, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'CyclingMotionFE';

  constructor(private darkModeService: DarkModeService) {}

  ngOnInit() {
    this.darkModeService.darkMode$.subscribe(isDarkMode => {
      document.body.classList.toggle('dark', isDarkMode);
    });
  }
}