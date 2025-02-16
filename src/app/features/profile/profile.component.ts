import { Component } from '@angular/core';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProfileService } from '../../core/services/profile/profile.service';
import { JsonPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SiteHeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  userData: any;
  profileInfo: any = {};
  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  profileForm = new FormGroup({
    firstname: new FormGroup(''),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    street: new FormControl(''),
    province: new FormControl(''),
    postalCode: new FormControl(''),
    phoneNumber: new FormControl(''),
  });

  ngOnInit() {
    // Get User ID from Auth Service (assuming it's stored in token)
    const userId = this.authService.getUserId();
    if (userId) {
      // Fetch Profile Data
      this.profileService.getProfile().subscribe((data) => {
        this.profileInfo = data;
        this.profileForm.patchValue({
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
  }

  editProfile(updatedData: any) {
    const userId = this.authService.getUserId();
    if (userId) {
      const profile = this.profileForm.value;
      const profileData = {
        userId: userId,
        firstName: profile.firstname,
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
    }
  }
}
