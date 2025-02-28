import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin/admin-auth.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminAuthService);
  const router = inject(Router);
  if (!adminService.isAuthenticated() && state.url !== '/admin') {
    router.navigate(['/admin']);
    return false;
  }
  if (adminService.isAuthenticated()) {
    if (state.url == '/admin') {
      router.navigate(['/dashboard']);
    }
    return true;
  }
  return true;
};
