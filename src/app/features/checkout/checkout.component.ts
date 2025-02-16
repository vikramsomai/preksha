import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProfileComponent } from '../profile/profile.component';
import { ProfileService } from '../../core/services/profile/profile.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounce, debounceTime } from 'rxjs';
import { UploadService } from '../admin/component/add-item/upload.service';
import { PaymentService } from '../../core/services/payment/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [SiteHeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cartlist!: any[];
  profileInfo: any;
  productList: any[] = [];
  selectedPaymentMethod: string = 'esewa'; // Default selection
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
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    street: new FormControl(''),
    province: new FormControl(''),
    postalCode: new FormControl(''),
    phoneNumber: new FormControl(''),
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
        console.log('gata data', data);
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
    };
    const products = this.productList.map((res) => {
      return {
        productId: res.product.productId,
        name: res.product.productName,
        price: res.product.price,
        quantity: res.product.qty,
      };
    });
    const shippingAddress = {
      address: profile.street,
      province: profile.province,
      postalCode: profile.postalCode,
    };
    const payment = {
      method: this.selectedPaymentMethod,
      transactionId: 'TXN1234567890',
      status: 'Paid',
    };
    const order = {
      users,
      products,
      payment,
      shippingAddress,
      totalAmount: this.cartService.getTotal(),
      status: 'Processing',
    };
    console.log(order);
    const amount = this.cartService.getTotal(); // Example amount
    const productId = '0x23bjd'; // Example product code
    if (products.length >= 1) {
      this.paymentService.initiatePayment(amount).subscribe({
        next: (response) => {
          window.location.href = response.url;
        },
        error: (err) => {
          console.error('Payment initiation failed', err);
        },
      });
    }
  }
}
