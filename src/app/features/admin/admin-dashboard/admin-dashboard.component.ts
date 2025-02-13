import { Component } from '@angular/core';
import { AddItemComponent } from '../component/add-item/add-item.component';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { ListItemComponent } from '../component/list-item/list-item.component';
import { OrderItemComponent } from "../component/order-item/order-item.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AddItemComponent, DashboardComponent, ListItemComponent, OrderItemComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  currentTab = 'dashboard';
  currentTitle = 'Dashboard';
  changeTab(tab: string, title: string) {
    this.currentTab = tab;
    this.currentTitle = title;
  }
}
