import { Component, inject } from '@angular/core';
import { AddItemComponent } from '../component/add-item/add-item.component';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { ListItemComponent } from '../component/list-item/list-item.component';
import { OrderItemComponent } from '../component/order-item/order-item.component';
import { AdminAuthService } from '../../../core/services/admin/admin-auth.service';
import { Router } from '@angular/router';
import { CategoryComponent } from '../category/category.component';
import { SubcategoryComponent } from '../subcategory/subcategory.component';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    AddItemComponent,
    DashboardComponent,
    ListItemComponent,
    OrderItemComponent,
    CategoryComponent,
    SubcategoryComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  currentTab = 'dashboard';
  currentTitle = 'Dashboard';
  adminService = inject(AdminAuthService);
  router = inject(Router);
  changeTab(tab: string, title: string) {
    this.currentTab = tab;
    this.currentTitle = title;
  }
  logout() {
    this.adminService.logout();
    this.router.navigate(['/admin']);
  }
}
