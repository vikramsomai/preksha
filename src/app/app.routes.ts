import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './features/user-dashboard/user-dashboard.component';
import { CartComponent } from './features/product/cart/cart.component';
import { WishlistComponent } from './features/product/wishlist/wishlist.component';
import { AdminLoginComponent } from './features/admin/admin-login/admin-login.component';

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
