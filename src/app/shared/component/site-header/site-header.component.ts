import { Component } from '@angular/core';
import { IWishlistList } from '../../../core/services/wishlist/wishlist.interface';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { Route, Router, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { LoginComponent } from '../../../features/auth/login/login.component';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterModule, LoginComponent],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  wishlist: IWishlistList[] = [];
  isLoggedIn = false;
  constructor(
    private authService: AuthService,
    private wishlistService: WishlistService,
    private route: Router,
    public cartService: CartService
  ) {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.wishlistService.wishlist$.subscribe((items) => {
      this.wishlist = items; // Update the local wishlist when data changes
    });
    console.log('user id', authService.getUserId());
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }
}
