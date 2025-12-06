import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../../../shared/component/footer/footer.component';
import { SiteHeaderComponent } from '../../../../shared/component/site-header/site-header.component';
import { ProductReviewsComponent } from '../../../../shared/component/product-reviews/product-reviews.component';
import { UploadService } from '../../../admin/component/add-item/upload.service';
import { CartService } from '../../../../core/services/cart/cart.service';
import { WishlistService } from '../../../../core/services/wishlist/wishlist.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, SiteHeaderComponent, RouterLink, ProductReviewsComponent],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss'
})
export class ViewProductComponent implements OnInit {
  imagePath = environment.apiImage;
  productId = '';
  product: any = null;
  loading = true;
  currentImageIndex = 0;
  quantity = 1;
  selectedSize = 'S';
  isAddingToCart = false;
  showNotification = false;
  notificationMessage = '';
  activeTab = 'description';
  relatedProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: UploadService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.productId = params.id;
      this.loadProduct();
    });
  }

  loadProduct(): void {
    this.loading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (res) => {
        this.product = res;
        this.product.selectedSize = this.selectedSize;
        this.loading = false;
        this.loadRelatedProducts();
      },
      error: (err) => {
        console.error('Failed to load product', err);
        this.loading = false;
      }
    });
  }

  loadRelatedProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Filter related products by same category, excluding current product
        this.relatedProducts = products
          .filter((p: any) => p.productId !== this.productId && p.category === this.product?.category)
          .slice(0, 4);
      },
      error: (err) => console.error('Failed to load related products', err)
    });
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  nextImage(): void {
    if (this.product?.imageUrls?.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.imageUrls.length;
    }
  }

  prevImage(): void {
    if (this.product?.imageUrls?.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0
        ? this.product.imageUrls.length - 1
        : this.currentImageIndex - 1;
    }
  }

  onSizeChange(size: string): void {
    this.selectedSize = size;
    if (this.product) {
      this.product.selectedSize = size;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    this.isAddingToCart = true;
    this.product.selectedSize = this.selectedSize;
    this.cartService.addToCart(this.product, this.quantity, this.selectedSize);

    this.showNotificationMessage('Added to cart successfully!');

    setTimeout(() => {
      this.isAddingToCart = false;
    }, 1500);
  }

  buyNow(): void {
    if (!this.product) return;

    this.product.selectedSize = this.selectedSize;
    this.cartService.addToCart(this.product, this.quantity, this.selectedSize);
    this.router.navigate(['/checkout']);
  }

  addToWishlist(): void {
    if (this.product) {
      if (this.isInWishlist()) {
        this.wishlistService.removeFromWishlist(this.product.productId);
        this.showNotificationMessage('Removed from wishlist');
      } else {
        this.wishlistService.addToWishlist(this.product);
        this.showNotificationMessage('Added to wishlist');
      }
    }
  }

  isInWishlist(): boolean {
    return this.product ? this.wishlistService.isInWishlist(this.product.productId) : false;
  }

  showNotificationMessage(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  getDiscountedPrice(): number {
    if (this.product?.price && this.product?.discount) {
      return Math.round(this.product.price + (this.product.price * this.product.discount) / 100);
    }
    return this.product?.price || 0;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  navigateToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }
}
