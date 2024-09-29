import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  toggleDarkMode() {
    const newDarkModeState = !this.darkModeSubject.value;
    this.darkModeSubject.next(newDarkModeState);
    document.documentElement.classList.toggle('dark', newDarkModeState);
  }
}