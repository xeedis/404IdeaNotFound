import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  private text: string = "Cycling is a great way to stay healthy and enjoy the outdoors. ";
  
  ngOnInit() {
    this.typeText();
  }

  private typeText() {
    const typedTextElement = document.querySelector('.typed-text') as HTMLElement;
    let index = 0;

    const type = () => {
      if (index < this.text.length) {
        typedTextElement.innerHTML += this.text.charAt(index);
        index++;
        setTimeout(type, 100); // Adjust typing speed here
      }
    };

    type();
  }
}
