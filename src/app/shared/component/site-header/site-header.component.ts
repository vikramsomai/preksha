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
  wishlistArray: any[] = [];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  ngOnInit(): void {
    const storedWishlist = localStorage.getItem('prekshawishlist');
    this.wishlistArray = storedWishlist ? JSON.parse(storedWishlist) : [];
    console.log('fetch', this.wishlistArray);
  }
}
