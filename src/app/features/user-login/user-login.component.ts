import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    SiteHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss',
})
export class UserLoginComponent {
  loginError = '';
  isLoading = false;

  constructor(private authService: AuthService, private route: Router) { }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  handleLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    const payload = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || '',
    };

    this.authService.login(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.route.navigateByUrl('/dd');
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.loginError = error.error?.error || error.error?.message || 'Login failed. Please try again.';
      },
    });
  }
}
