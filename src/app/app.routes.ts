import { Routes } from '@angular/router';
import { UserDashboardComponent } from './features/user-dashboard/user-dashboard.component';
import { WishlistComponent } from './features/product/wishlist/wishlist.component';
import { AdminLoginComponent } from './features/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
  },
  {
    path: 'admin',
    component: AdminLoginComponent,
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth-routing.module').then(
        (m) => m.AuthRoutingModule
      ),
  },
];
