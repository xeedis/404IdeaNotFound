import {NgClass, NgIf} from '@angular/common';
import { Component } from '@angular/core';
import { DarkModeService } from '../../shared/services/dark-mode.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    NgIf


  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isOpen = false;
  isDarkMode = false;

  constructor(private darkModeService: DarkModeService) {
    this.darkModeService.darkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}