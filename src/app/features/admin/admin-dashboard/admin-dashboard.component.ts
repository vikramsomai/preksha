import { Component, inject, OnInit } from '@angular/core';
import { AddItemComponent } from '../component/add-item/add-item.component';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { ListItemComponent } from '../component/list-item/list-item.component';
import { OrderItemComponent } from '../component/order-item/order-item.component';
import { AdminAuthService } from '../../../core/services/admin/admin-auth.service';
import { Router } from '@angular/router';
import { CategoryComponent } from '../category/category.component';
import { SubcategoryComponent } from '../subcategory/subcategory.component';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../core/services/orders/orders.service';

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
    CommonModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  currentTab = 'dashboard';
  currentTitle = 'Dashboard';
  sidebarCollapsed = false;
  pendingOrdersCount = 0;

  adminService = inject(AdminAuthService);
  router = inject(Router);
  orderService = inject(OrdersService);

  ngOnInit() {
    this.loadPendingOrdersCount();
    // Check screen size on init
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize() {
    if (window.innerWidth < 1024) {
      this.sidebarCollapsed = true;
    }
  }

  loadPendingOrdersCount() {
    this.orderService.getProducts().subscribe({
      next: (response) => {
        const orders = response.orders || response;
        this.pendingOrdersCount = (orders as any[]).filter(
          (o: any) => o.status === 'Order Placed' || o.status === 'Packed'
        ).length;
      },
      error: (err: any) => console.error('Failed to load orders count', err)
    });
  }

  changeTab(tab: string, title: string) {
    this.currentTab = tab;
    this.currentTitle = title;
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      this.sidebarCollapsed = true;
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout() {
    this.adminService.logout();
    this.router.navigate(['/admin']);
  }
}
