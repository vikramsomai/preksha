import { Component } from '@angular/core';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
