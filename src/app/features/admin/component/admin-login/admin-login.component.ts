import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminAuthService } from '../../../../core/services/admin/admin-auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminAuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  adminForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  login(): void {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = {
      username: this.adminForm.value.username || '',
      password: this.adminForm.value.password || ''
    };

    this.adminService.login(credentials).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.adminService.setupAutoLogout();
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Login failed. Please try again.';
      }
    });
  }

  get usernameControl() {
    return this.adminForm.get('username');
  }

  get passwordControl() {
    return this.adminForm.get('password');
  }
}
