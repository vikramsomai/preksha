import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UploadService } from '../admin/component/add-item/upload.service';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, SiteHeaderComponent, RouterLink],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',
})
export class CollectionsComponent implements OnInit {
  imagePath = environment.apiImage;
  currentIndex = 0;
  selectedProduct: any;
  productData: any;
  productId = '';
  quantity = 1;
  selectedSize = 'S';
  isAddingToCart = false;
  showAddedMessage = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: UploadService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((res: any) => {
      this.productId = res.id;
      this.loadProduct();
    });
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (res) => {
        this.productData = res;
        this.selectedProduct = res;
        this.selectedProduct.selectedSize = this.selectedSize;
        console.log(this.productData);
      },
      error: (err) => {
        console.error('Failed to load product', err);
      }
    });
  }

  nextImage(): void {
    if (this.selectedProduct?.imageUrls?.length > 1) {
      this.currentIndex = (this.currentIndex + 1) % this.selectedProduct.imageUrls.length;
    }
  }

  prevImage(): void {
    if (this.selectedProduct?.imageUrls?.length > 1) {
      this.currentIndex = this.currentIndex === 0
        ? this.selectedProduct.imageUrls.length - 1
        : this.currentIndex - 1;
    }
  }

  onSizeChange(size: string): void {
    this.selectedSize = size;
    if (this.selectedProduct) {
      this.selectedProduct.selectedSize = size;
    }
  }

  decreaseQunatity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addQunatity(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  addToCart(product: any): void {
    console.log("product", product)
    if (!product) return;

    this.isAddingToCart = true;

    // Ensure size is set
    if (!product.selectedSize) {
      product.selectedSize = this.selectedSize;
    }

    this.cartService.addToCart(product, this.quantity, product.selectedSize);

    // Show success feedback
    this.showAddedMessage = true;

    // Open cart sidebar modal
    this.openCartModal();

    setTimeout(() => {
      this.isAddingToCart = false;
      this.showAddedMessage = false;
    }, 2000);
  }

  openCartModal(): void {
    // Use Bootstrap's modal API to open the cart sidebar
    const modalElement = document.getElementById('shoppingCart');
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap && bootstrap.Modal) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }

  addToWishlist(product: any): void {
    if (product) {
      this.wishlistService.addToWishlist(product);
    }
  }

  isInWishlist(product: any): boolean {
    return product ? this.wishlistService.isInWishlist(product.productId) : false;
  }

  buyNow(product: any): void {
    if (!product) return;

    if (!product.selectedSize) {
      product.selectedSize = this.selectedSize;
    }

    this.cartService.addToCart(product, this.quantity, product.selectedSize);
    this.router.navigate(['/checkout']);
  }
}
