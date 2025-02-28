import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin/admin-auth.service';

export const adminNoAuthGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminAuthService);
  const router = inject(Router);
  if (adminService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
