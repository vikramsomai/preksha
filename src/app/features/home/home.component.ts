import { ChangeDetectorRef, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { IWishlistList } from '../../core/services/wishlist/wishlist.interface';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { CartService } from '../../core/services/cart/cart.service';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { UploadService } from '../admin/component/add-item/upload.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { FilterPipe } from '../../shared/pipes/filter.pipe';
import { SliderComponent } from '../../shared/slider/slider.component';
import { environment } from '../../../environments/environment';
import { SearchItemPipe } from '../../shared/pipes/search-item.pipe';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    FooterComponent,
    FilterPipe,
    SliderComponent,
    SearchItemPipe,
  ],
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
})
export class HomeComponent implements OnInit {
  imagePath = environment.apiImage;
  quantity: number = 1; // Default quantity
  selectedFilterCategory = '';
  loading: boolean = true;
  productList: any[] = [];
  selectedProduct: any;
  cartForm: FormGroup;
  email = 'prekshaaclothing@gmail.com';
  mainImage: string = '';
  currentIndex: number = 0; // To track the current image index
  wishlist: IWishlistList[] = [];
  cartlist: any[] = [];
  newCartList: any[] = [];
  showCartNotification = false;
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public cartService: CartService,
    private uploadService: UploadService,
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.cartForm = this.fb.group({
      color: new FormControl('', Validators.required),
      size: new FormControl('', Validators.required),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
    this.wishlistService.wishlist$.subscribe((items) => {
      this.wishlist = items; // Update the local wishlist when data changes
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
    this.mainImage = this.selectedProduct?.imageUrls[0];
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  fetchProducts(): void {
    this.uploadService.getProducts().subscribe(
      (data) => {
        this.productList = data;
        console.log('product dadadadaa', data);
        this.newCartList = this.cartlist.map((cartItem) => {
          const matchedProduct = this.productList.find(
            (product) => product.productId === cartItem.product.productId
          );

          if (matchedProduct) {
            cartItem.product.price = matchedProduct.price;
            return {
              ...cartItem,
            };
          }
          return cartItem; // Keep the original cartItem if no match is found
        });
        this.cdr.detectChanges();
      },
      (err) => {
        console.error('Error fetching products:', err);
      }
    );
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

  openQuickAddModal(product: any) {
    this.selectedProduct = product;

    // Pre-fill the form with the default values of the selected product
    this.cartForm.patchValue({
      color: product.colors[0],
      size: product.sizes[0],
      quantity: 1,
    });
    console.log(this.cartForm.value);
  }
  updateQunatity(action: string, item: any): void {
    const currentQuantity = item.quantity;
    let updatedQuantity = currentQuantity;

    if (action === 'add' && currentQuantity < 10) {
      updatedQuantity++;
    } else if (action === 'delete' && currentQuantity > 1) {
      updatedQuantity--;
    }

    this.cartService.updateCartItemQuantity(
      item.product.productId,
      item.selectedSize,
      updatedQuantity
    );
  }

  onSubmit() {
    if (this.cartForm.valid) {
      const formData = this.cartForm.value;
    }
  }
  addToCart(item: any): void {
    if (item.selectedSize == undefined) {
      item.selectedSize = 'S';
    }
    this.cartService.addToCart(item, this.quantity, item.selectedSize);

    // Close any open modals
    if (this.isBrowser) {
      const modals = document.querySelectorAll('.modal.show');
      modals.forEach((modal: any) => {
        const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      });
      // Remove backdrop if still visible
      setTimeout(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 300);
    }

    // Show notification
    this.showCartNotification = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.showCartNotification = false;
      this.cdr.detectChanges();
    }, 3000);

    // Reset quantity
    this.quantity = 1;
  }

  addItem(item: any): void {
    this.wishlistService.addToWishlist(item);
  }
  removeItem(item: any): void {
    this.wishlistService.removeFromWishlist(item.productId);
  }

  clearAll(): void {
    this.wishlistService.clearWishlist();
  }
  isInWishlist(product: any): boolean {
    return this.wishlistService.isInWishlist(product.productId);
  }
  setSelectedProduct(product: any) {
    this.selectedProduct = product;
  }

  addQunatity(): void {
    if (this.quantity < 10) {
      this.quantity += 1;
    }
  }

  decreaseQunatity(): void {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  // Method to update selected color
  onColorChange(color: string): void {
    this.selectedProduct.selectedColor = color;
  }

  // Method to update selected size
  onSizeChange(size: string): void {
    this.selectedProduct.selectedSize = size;
  }

  removeCartItem(productId: any, selectedSize: any) {
    this.cartService.removeFromCart(productId, selectedSize);
  }

  // Mobile filter properties
  showMobileFilter = false;
  activeFilterCount = 0;
  selectedGender = '';
  selectedPriceRange = '';

  toggleMobileFilter(): void {
    this.showMobileFilter = !this.showMobileFilter;
  }

  updateFilterCount(): void {
    let count = 0;
    if (this.selectedGender) count++;
    if (this.selectedFilterCategory) count++;
    if (this.selectedPriceRange) count++;
    this.activeFilterCount = count;
  }

  changeGender(event: any) {
    this.selectedGender = event.target.value;
    this.updateFilterCount();
  }

  chnageCategory(event: any) {
    this.selectedFilterCategory = event.target.value;
    this.updateFilterCount();
  }

  changePriceRange(event: any) {
    this.selectedPriceRange = event.target.value;
    this.updateFilterCount();
  }

  clearFilters(gender: any, category: any, priceRange: any): void {
    gender.value = '';
    category.value = '';
    priceRange.value = '';
    this.selectedGender = '';
    this.selectedFilterCategory = '';
    this.selectedPriceRange = '';
    this.activeFilterCount = 0;
  }

  showDisocuntPrice(price: number, discount: number): number {
    let fakePrice = price + (price * discount) / 100;
    return Math.round(fakePrice); // Rounded for better display
  }
}
