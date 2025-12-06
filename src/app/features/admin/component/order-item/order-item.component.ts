import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../../core/services/orders/orders.service';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, CommonModule],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent implements OnInit {
  orderList: any[] = [];
  isLoading = true;

  constructor(private orderService: OrdersService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getProducts().subscribe({
      next: (res) => {
        // Handle both response formats
        this.orderList = res.orders || res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.isLoading = false;
      }
    });
  }
  statusChange(orderId: any, event: any) {
    const status = event.target.value;
    console.log(status, orderId);
    this.orderService.updateOrderStatus(orderId, status).subscribe((res) => {
      console.log('status changes');
    });
  }
}
