import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProfileComponent } from '../profile/profile.component';
import { ProfileService } from '../../core/services/profile/profile.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounce, debounceTime } from 'rxjs';
import { UploadService } from '../admin/component/add-item/upload.service';
import { PaymentService } from '../../core/services/payment/payment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [SiteHeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cartlist!: any[];
  router = inject(Router);
  profileInfo: any;
  phonePattern = /^[6-9]\d{9}$/;
  productList: any[] = [];
  selectedPaymentMethod = 'ESEWA'; // Default selection
  constructor(
    public cartService: CartService,
    private authService: AuthService,
    private productService: UploadService,
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
    email: new FormControl('', Validators.required),
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
      // Fetch Profile Data
      this.profileService.getProfile().subscribe((data) => {
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
      });
    }
    this.profileForm.valueChanges.pipe(debounceTime(1400)).subscribe((res) => {
      console.log('change value', this.profileForm.value);
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
      this.profileService.updateProfile(profileData).subscribe((res) => {
        console.log('success', res);
      });
    });
    this.cartService.cart$.subscribe((res) => {
      this.productList = res;
    });
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
  }
  placeOrder() {
    const userId = this.authService.getUserId();
    const profile = this.profileForm.value;
    const users = {
      userId: userId,
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      email: this.profileForm.value.email,
      phoneNumber: this.profileForm.value.phoneNumber,
    };
    const products = this.productList.map((res) => {
      return {
        productId: res.product.productId,
        name: res.product.productName,
        price: res.product.price,
        quantity: res.quantity,
        image: res.product.imageUrls[0],
        size: res.selectedSize,
      };
    });
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
      totalAmount: this.cartService.getTotal(),
      status: 'Order Placed',
    };
    const amount = this.cartService.getTotal(); // Example amount

    if (this.profileForm.valid) {
      if (this.selectedPaymentMethod == 'ESEWA') {
        this.paymentService.initiatePayment(amount, order).subscribe({
          next: (response) => {
            window.location.href = response.url;
          },
          error: (err) => {
            console.error('Payment initiation failed', err);
          },
        });
      } else if (this.selectedPaymentMethod === 'KHALTI') {
        //khaliti
      } else if (this.selectedPaymentMethod === 'COD') {
        this.paymentService.codInitiatePayment(order).subscribe({
          next: (res) => {
            this.router.navigate(['/order']);
          },
          error: (err) => {
            console.error('Payment initiation failed', err);
          },
        });
      }
    }
  }
  generateTransactionId(): string {
    const prefix = 'TXN';
    const timestamp = Date.now(); // Current timestamp for uniqueness
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Random 6-digit number
    return `${prefix}${timestamp}${randomNumber}`;
  }
}
