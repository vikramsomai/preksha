import { Component } from '@angular/core';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProfileService } from '../../core/services/profile/profile.service';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    FooterComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  userData: any;
  profileInfo: any = {};
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private profileService: ProfileService
  ) {}

  profileForm = new FormGroup({
    firstName: new FormGroup(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    city: new FormControl(''),
    street: new FormControl(''),
    zipCode: new FormControl(''),
    phoneNumber: new FormControl(''),
  });

  ngOnInit() {
    // Get User ID from Auth Service (assuming it's stored in token)
    const userId = this.authService.getUserId();
    if (userId) {
      // Fetch Profile Data
      this.profileService.getProfile().subscribe((data) => {
        this.profileInfo = data;
        console.log('gata data', data);
      });
    }
  }

  // To handle profile updates, we'll create a method to edit the profile.
  editProfile(updatedData: any) {
    const userId = this.authService.getUserId();
    if (userId) {
      this.profileService.updateProfile(updatedData).subscribe((response) => {
        console.log('Profile updated:', response);
        this.profileInfo = response; // Update the displayed profile info
      });
    }
  }
  removeCartItem(item: any) {
    const product = item.product;
    this.cartService.removeFromCart(
      product.id,
      product.selectedColor,
      product.selectedSize
    );
  }
}
