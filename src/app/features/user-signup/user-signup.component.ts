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

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [
    FooterComponent,
    SiteHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
    FormErrorComponent,
  ],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.scss',
})
export class UserSignupComponent {
  otpMessage!: string;
  errorMessage!: string;
  formMode: string = 'register';
  constructor(private authService: AuthService, private route: Router) {}
  signupForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  otpForm = new FormGroup({
    otp: new FormControl('', Validators.required),
  });
  handleSignup() {
    if (this.signupForm.valid) {
      this.formMode = 'otp';
      this.authService.sendOtp(this.signupForm.value.email).subscribe((res) => {
        console.log(res);
      });
    } else {
      this.errorMessage = 'Please fill all the details';
    }
  }

  verifyOtp() {
    const payload = {
      firstname: this.signupForm.value.firstname || '',
      lastname: this.signupForm.value.lastname || '',
      email: this.signupForm.value.email || '',
      password: this.signupForm.value.password || '',
    };
    if (this.otpForm.valid) {
      this.authService
        .verifyOtp(
          this.signupForm.value.email,
          this.otpForm.value.otp?.toString()
        )
        .subscribe((res) => {
          this.authService.register(payload).subscribe({
            next: (Response) => {
              this.route.navigateByUrl('/login');
            },
          });
        });
    }
  }
}
