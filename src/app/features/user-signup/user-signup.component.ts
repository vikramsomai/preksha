import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorComponent } from '../../shared/component/form-error/form-error.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [
    FooterComponent,
    SiteHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
    FormErrorComponent,
    CommonModule
  ],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.scss',
})
export class UserSignupComponent {
  otpMessage = '';
  errorMessage = '';
  formMode: 'register' | 'otp' = 'register';
  isLoading = false;

  constructor(private authService: AuthService, private route: Router) { }

  signupForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)
    ]),
  });

  otpForm = new FormGroup({
    otp: new FormControl('', Validators.required),
  });

  handleSignup() {
    if (this.signupForm.valid) {
      const email = this.signupForm.value.email || '';
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.sendOtp(email).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.formMode = 'otp';
          this.otpMessage = 'OTP sent to your email';
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Failed to send OTP';
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
      this.errorMessage = 'Please fill all the details correctly';
    }
  }

  verifyOtp() {
    if (!this.otpForm.valid) {
      this.errorMessage = 'Please enter the OTP';
      return;
    }

    const email = this.signupForm.value.email || '';
    const otp = this.otpForm.value.otp?.toString() || '';

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.verifyOtp(email, otp).subscribe({
      next: (res) => {
        // OTP verified, now register the user
        const payload = {
          firstname: this.signupForm.value.firstname || '',
          lastname: this.signupForm.value.lastname || '',
          email: email,
          password: this.signupForm.value.password || '',
        };

        this.authService.register(payload).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.route.navigateByUrl('/login');
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.message || 'Registration failed';
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Invalid OTP';
      }
    });
  }

  resendOtp() {
    const email = this.signupForm.value.email || '';
    if (!email) return;

    this.isLoading = true;
    this.authService.sendOtp(email).subscribe({
      next: () => {
        this.isLoading = false;
        this.otpMessage = 'OTP resent to your email';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to resend OTP';
      }
    });
  }

  backToRegister() {
    this.formMode = 'register';
    this.otpForm.reset();
  }
}
