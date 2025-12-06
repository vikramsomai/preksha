import { Component, inject } from '@angular/core';
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
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { OrdersService } from '../../core/services/orders/orders.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SiteHeaderComponent, FooterComponent, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  userData: any;
  profileInfo: any = {};
  isSaving = false;
  phonePattern = /^[6-9]\d{9}$/;

  // Tab management
  activeTab: 'profile' | 'orders' | 'wishlist' = 'profile';

  // Orders data
  orders: any[] = [];
  loadingOrders = false;

  // Wishlist data
  wishlistItems: any[] = [];
  imagePath = environment.apiImage;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private wishlistService: WishlistService,
    private ordersService: OrdersService
  ) { }

  profileForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    street: new FormControl('', [Validators.required]),
    province: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(this.phonePattern)]),
  });

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.profileService.getProfile().subscribe({
        next: (data) => {
          this.profileInfo = data;
          this.profileForm.patchValue({
            firstname: data.firstName,
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
          this.showNotification('Failed to load profile data', 'error');
        }
      });
    }

    // Subscribe to wishlist
    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistItems = items;
    });
  }

  switchTab(tab: 'profile' | 'orders' | 'wishlist') {
    this.activeTab = tab;
    if (tab === 'orders' && this.orders.length === 0) {
      this.loadOrders();
    }
  }

  loadOrders() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.loadingOrders = true;
    this.ordersService.getProductsById(userId).subscribe({
      next: (data: any) => {
        this.orders = data.orders || data || [];
        this.loadingOrders = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.loadingOrders = false;
      }
    });
  }

  removeFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId);
    this.showNotification('Item removed from wishlist', 'success');
  }

  showNotification(message: string, type: 'success' | 'error' = 'success') {
    this._snackBar.open(message, '✕', {
      horizontalPosition: this.horizontalPosition,
      duration: 3000,
      verticalPosition: this.verticalPosition,
      panelClass: type === 'error' ? 'snackbar-error' : 'snackbar-success'
    });
  }

  editProfile() {
    if (!this.profileForm.valid) {
      this.profileForm.markAllAsTouched();
      this.showNotification('Please fill all required fields correctly', 'error');
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.showNotification('Session expired. Please login again.', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.isSaving = true;
    const profile = this.profileForm.value;
    const profileData = {
      firstname: profile.firstname || '',
      lastname: profile.lastName || '',
      email: profile.email || '',
      address: profile.street || '',
      phone: profile.phoneNumber || '',
      city: '',
      country: 'Nepal'
    };

    this.profileService.updateProfile(profileData).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showNotification('Profile updated successfully!', 'success');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to update profile', err);
        this.showNotification(err.message || 'Failed to update profile. Please try again.', 'error');
      }
    });
  }

  logout() {
    this.authService.logout();
    this.showNotification('Logged out successfully', 'success');
    this.router.navigate(['/']);
  }
}
