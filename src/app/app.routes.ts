import { Routes } from '@angular/router';
import { UserDashboardComponent } from './features/user-dashboard/user-dashboard.component';
import { WishlistComponent } from './features/product/wishlist/wishlist.component';
import { AdminLoginComponent } from './features/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { CartComponent } from './features/product/cart/cart.component';
import { ProfileComponent } from './features/profile/profile.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { authGuard } from './core/guards/auth.guard';
import { UserLoginComponent } from './features/user-login/user-login.component';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { UserSignupComponent } from './features/user-signup/user-signup.component';
import { OrderComponent } from './features/order/order.component';
import { SuccessPaymentComponent } from './shared/component/success-payment/success-payment.component';
import { FailurePaymentComponent } from './shared/component/failure-payment/failure-payment.component';
import { PrintInvoiceComponent } from './shared/component/print-invoice/print-invoice.component';
import { adminAuthGuard } from './core/guards/admin-auth.guard';
import { adminNoAuthGuard } from './core/guards/admin--no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
  },
  {
    path: 'admin',
    component: AdminLoginComponent,
    canActivate: [adminAuthGuard],
  },
  {
    path: 'login',
    component: UserLoginComponent,
    canActivate: [noAuthGuard],
  },
  {
    path: 'register',
    component: UserSignupComponent,
    canActivate: [noAuthGuard],
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    canActivate: [adminAuthGuard],
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard],
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [authGuard],
  },
  {
    path: 'payment-success',
    component: SuccessPaymentComponent,
  },
  {
    path: 'payment-failure',
    component: FailurePaymentComponent,
  },
  { path: 'print/:id', component: PrintInvoiceComponent },
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
