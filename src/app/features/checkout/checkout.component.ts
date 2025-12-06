import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProfileService } from '../../core/services/profile/profile.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';
import { PaymentService } from '../../core/services/payment/payment.service';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product/product.service';
import { CommonModule } from '@angular/common';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { CouponService, CouponValidation } from '../../core/services/coupon/coupon.service';
import { ShippingService, ShippingInfo } from '../../core/services/shipping/shipping.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [SiteHeaderComponent, FooterComponent, ReactiveFormsModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cartlist: any[] = [];
  router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  private couponService = inject(CouponService);
  private shippingService = inject(ShippingService);

  profileInfo: any;
  phonePattern = /^[6-9]\d{9}$/;
  productList: any[] = [];
  selectedPaymentMethod = 'ESEWA';
  isProcessing = false;

  // Coupon
  couponCode = '';
  isApplyingCoupon = false;
  appliedCoupon: CouponValidation | null = null;

  // Shipping
  shippingInfo: ShippingInfo | null = null;

  constructor(
    public cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private paymentService: PaymentService,
    private profileService: ProfileService
  ) {
    this.cartService.cart$.subscribe((items) => {
      this.cartlist = items;
    });
  }

  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    street: new FormControl('', Validators.required),
    province: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [
      Validators.pattern(this.phonePattern),
      Validators.required,
    ]),
  });

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.profileService.getProfile().subscribe({
        next: (data) => {
          this.profileInfo = data;
          this.profileForm.patchValue({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            street: data.address,
            province: data.province,
            postalCode: data.postalCode,
            phoneNumber: data.phoneNumber,
          });
        },
        error: (err) => {
          console.error('Failed to load profile', err);
        }
      });
    }

    // Auto-save profile changes
    this.profileForm.valueChanges.pipe(debounceTime(1500)).subscribe((res) => {
      if (this.profileForm.valid && userId) {
        const profile = this.profileForm.value;
        const profileData = {
          userId: userId,
          firstname: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          address: profile.street,
          province: profile.province,
          postalCode: profile.postalCode,
          phoneNumber: profile.phoneNumber,
        };
        this.profileService.updateProfile(profileData).subscribe({
          next: () => console.log('Profile auto-saved'),
          error: (err) => console.error('Auto-save failed', err)
        });
      }
    });

    // Load shipping when province changes
    this.profileForm.get('province')?.valueChanges.subscribe(() => {
      this.loadShippingCharge();
    });

    // Load initial shipping if province is set
    if (this.profileForm.get('province')?.value) {
      this.loadShippingCharge();
    }

    this.cartService.cart$.subscribe((res) => {
      this.productList = res;
    });
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
  }

  showNotification(message: string, type: 'success' | 'error' = 'success') {
    this._snackBar.open(message, '✕', {
      horizontalPosition: 'right',
      duration: 3000,
      verticalPosition: 'top',
      panelClass: type === 'error' ? 'snackbar-error' : 'snackbar-success'
    });
  }

  placeOrder() {
    // Validate form first
    if (!this.profileForm.valid) {
      this.profileForm.markAllAsTouched();
      this.showNotification('Please fill all required fields correctly', 'error');
      return;
    }

    if (this.cartlist.length === 0) {
      this.showNotification('Your cart is empty', 'error');
      return;
    }

    this.isProcessing = true;
    const userId = this.authService.getUserId();
    const profile = this.profileForm.value;

    const users = {
      userId: userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
    };

    const products = this.productList.map((res) => ({
      productId: res.product.productId,
      name: res.product.productName,
      price: res.product.price,
      quantity: res.quantity,
      image: res.product.imageUrls[0],
      size: res.selectedSize,
    }));

    const shippingAddress = {
      address: profile.street,
      province: profile.province,
      postalCode: profile.postalCode,
    };

    const payment = {
      method: this.selectedPaymentMethod,
      transactionId: this.generateTransactionId(),
      status: 'PENDING',
    };

    const order = {
      users,
      products,
      payment,
      shippingAddress,
      subtotal: this.cartService.getTotal(),
      shippingCharge: this.getShippingCharge(),
      couponCode: this.appliedCoupon?.code || this.couponCode || null,
      couponDiscount: this.getDiscount(),
      totalAmount: this.getFinalTotal(),
      status: 'Order Placed',
    };

    const amount = this.getFinalTotal();

    if (this.selectedPaymentMethod === 'ESEWA') {
      this.productService.saveOrderData(order);
      this.paymentService.initiatePayment(amount, order).subscribe({
        next: (response) => {
          if (response.url) {
            window.location.href = response.url;
          } else {
            this.isProcessing = false;
            this.showNotification('Payment URL not received. Please try again.', 'error');
          }
        },
        error: (err) => {
          this.isProcessing = false;
          console.error('Payment initiation failed', err);
          this.showNotification('Payment initiation failed. Please try again.', 'error');
        },
      });
    } else if (this.selectedPaymentMethod === 'COD') {
      this.paymentService.codInitiatePayment(order).subscribe({
        next: (res) => {
          this.isProcessing = false;
          this.cartService.clearCart();
          this.showNotification('Order placed successfully!', 'success');
          this.router.navigate(['/order']);
        },
        error: (err) => {
          this.isProcessing = false;
          console.error('Order placement failed', err);
          this.showNotification('Failed to place order. Please try again.', 'error');
        },
      });
    }
  }

  generateTransactionId(): string {
    const prefix = 'TXN';
    const timestamp = Date.now();
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}${timestamp}${randomNumber}`;
  }

  // Coupon methods
  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      this.showNotification('Please enter a coupon code', 'error');
      return;
    }

    const province = this.profileForm.get('province')?.value || '';
    const subtotal = this.cartService.getTotal();

    this.isApplyingCoupon = true;
    this.couponService.validateCoupon(this.couponCode, subtotal, province).subscribe({
      next: (result) => {
        this.isApplyingCoupon = false;
        if (result.valid) {
          this.appliedCoupon = result;
          this.showNotification(`Coupon applied! You saved NPR ${result.discount}`, 'success');
        }
      },
      error: (err) => {
        this.isApplyingCoupon = false;
        const message = err.error?.message || 'Invalid coupon code';
        this.showNotification(message, 'error');
      }
    });
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.couponCode = '';
    this.couponService.removeCoupon();
    this.showNotification('Coupon removed', 'success');
  }

  // Shipping methods
  loadShippingCharge(): void {
    const province = this.profileForm.get('province')?.value;
    if (!province) return;

    const subtotal = this.cartService.getTotal();
    this.shippingService.getShippingCharge(province, subtotal).subscribe({
      next: (info) => {
        this.shippingInfo = info;
      },
      error: (err) => {
        console.error('Failed to load shipping', err);
      }
    });
  }

  // Calculate final total with shipping and coupon
  getFinalTotal(): number {
    let total = this.cartService.getTotal();

    // Add shipping
    if (this.shippingInfo && !this.shippingInfo.isFreeShipping) {
      total += this.shippingInfo.shippingCharge;
    }

    // Subtract coupon discount
    if (this.appliedCoupon && this.appliedCoupon.discount) {
      total -= this.appliedCoupon.discount;
    }

    return Math.max(0, total);
  }

  getDiscount(): number {
    return this.appliedCoupon?.discount || 0;
  }

  getShippingCharge(): number {
    if (!this.shippingInfo) return 0;
    return this.shippingInfo.isFreeShipping ? 0 : this.shippingInfo.shippingCharge;
  }
}
