import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../../shared/component/footer/footer.component';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteHeaderComponent, FooterComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WishlistComponent implements OnInit, OnDestroy {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  wishlist: any[] = [];
  isLoading = true;
  private subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.wishlistService.wishlist$.subscribe((items) => {
      this.wishlist = items;
      this.isLoading = false;
    });

    // Try to load from API if logged in
    this.wishlistService.loadFromApi().subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.removeFromWishlist(productId);
    this.showNotification('Item removed from wishlist');
  }

  addToCart(item: any): void {
    const product = {
      productId: item.productId || item._id,
      productName: item.productName,
      price: item.price,
      imageUrls: item.imageUrls || [item.image]
    };
    const quantity = 1;
    const selectedSize = item.sizes?.[0] || 'M';
    this.cartService.addToCart(product, quantity, selectedSize);
    this.showNotification('Item added to cart');
  }

  addAllToCart(): void {
    this.wishlist.forEach(item => this.addToCart(item));
    this.showNotification(`${this.wishlist.length} items added to cart`);
  }

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      this.wishlistService.clearWishlist();
      this.showNotification('Wishlist cleared');
    }
  }

  get totalValue(): number {
    return this.wishlist.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, '✕', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
