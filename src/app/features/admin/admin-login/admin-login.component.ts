import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminAuthService } from '../../../core/services/admin/admin-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
})
export class AdminLoginComponent {
  constructor(
    private fb: FormBuilder,
    private adminService: AdminAuthService
  ) {}
  router = inject(Router);
  adminForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  login() {
    this.adminService.Login(this.adminForm.value).subscribe((res) => {
      this.adminService.saveToken(res.token);
      this.router.navigateByUrl('/dashboard');
    });
  }
}
