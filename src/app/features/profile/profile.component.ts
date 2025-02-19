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
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SiteHeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
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
        this._snackBar.open('Profile updated successfully', '', {
          horizontalPosition: 'right',
          duration: 2 * 1000,
          verticalPosition: 'top',
        });
      });
    }
  }
}
