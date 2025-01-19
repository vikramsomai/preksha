import { Component } from '@angular/core';
import { IWishlistList } from '../../../core/services/wishlist/wishlist.interface';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { Route, Router, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  wishlist: IWishlistList[] = [];
  constructor(
    private wishlistService: WishlistService,
    private route: Router,
    public cartService: CartService
  ) {
    this.wishlistService.wishlist$.subscribe((items) => {
      this.wishlist = items; // Update the local wishlist when data changes
    });
  }
}
