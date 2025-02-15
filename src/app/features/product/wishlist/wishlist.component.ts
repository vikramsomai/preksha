import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { SiteHeaderComponent } from '../../../shared/component/site-header/site-header.component';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { IWishlistList } from '../../../core/services/wishlist/wishlist.interface';
import { JsonPipe } from '@angular/common';
import { FooterComponent } from '../../../shared/component/footer/footer.component';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [SiteHeaderComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WishlistComponent {
  mainImage: string = '';
  quantity: number = 1; // Default quantity
  currentIndex: number = 0; // To track the current image index
  wishlist: any[] = [];
  selectedProduct: any;
  private subscription!: Subscription;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.subscription = this.wishlistService.wishlist$.subscribe((items) => {
      this.wishlist = items;
    });
    this.mainImage = this.selectedProduct?.imageUrls[0];
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  setSelectedProduct(product: any) {
    this.selectedProduct = product;
    console.log('Selected Product:', this.selectedProduct);
  }
  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.selectedProduct.imageUrls.length - 1; // Loop to the last image
    }
    this.mainImage = this.selectedProduct.imageUrls[this.currentIndex];
  }

  // Function to go to the next image
  nextImage(): void {
    if (this.currentIndex < this.selectedProduct.imageUrls.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to the first image
    }
    this.mainImage = this.selectedProduct.imageUrls[this.currentIndex];
  }
  onSizeChange(size: string): void {
    this.selectedProduct.selectedSize = size;
  }
  addToCart(item: any) {
    const newItem = {
      productId: item.productId,
      productName: item.productName,
      imageUrls: item.imageUrls,
      qty: item.qty,
    };

    // this.cartService.addToCart(
    //   newItem,
    //   this.quantity,
    //   item.selectedSize
    // ); // Add 2 units of the product
    // console.log('qunatity', item);
  }

  addQunatity(): void {
    this.quantity += 1;
  }

  decreaseQunatity(): void {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }
}
