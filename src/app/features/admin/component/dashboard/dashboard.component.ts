import { Component, OnInit } from '@angular/core';
import { OrdersService, Order } from '../../../../core/services/orders/orders.service';
import { ProductService } from '../../../../core/services/product/product.service';
import { UploadService } from '../add-item/upload.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, DatePipe, DecimalPipe, RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  orderData: Order[] = [];
  productData: any[] = [];
  topSelling: any;
  isLoading = true;
  errorMessage = '';

  constructor(
    private orderService: OrdersService,
    private productService: UploadService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load orders
    this.orderService.getProducts().subscribe({
      next: (res) => {
        // Handle new response format with orders array
        this.orderData = (res.orders || res).sort((a: Order, b: Order) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.errorMessage = err.message || 'Failed to load orders';
        this.isLoading = false;
      }
    });

    // Load products
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.productData = res;
      },
      error: (err) => console.error('Failed to load products', err)
    });

    // Load top selling
    this.getTopSelling();
  }

  getTotalOrders(): number {
    return this.orderData.length;
  }

  getTotalOrderAmount(): number {
    return this.orderData.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  }

  getTotalStock(): number {
    return this.productData.reduce((sum, item) => sum + (item.qty || 0), 0);
  }

  getTopSelling(): void {
    this.orderService.getTopselling().subscribe({
      next: (res) => {
        this.topSelling = res;
      },
      error: (err) => console.error('Failed to get top selling', err)
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Order Placed': 'status-placed',
      'Processing': 'status-processing',
      'Packed': 'status-packed',
      'Shipped': 'status-shipped',
      'Out for Delivery': 'status-out',
      'Delivered': 'status-delivered',
      'Cancelled': 'status-cancelled'
    };
    return statusMap[status] || '';
  }

  getPaymentStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'COMPLETE': 'payment-complete',
      'PENDING': 'payment-pending',
      'FAILED': 'payment-failed',
      'REFUNDED': 'payment-refunded'
    };
    return statusMap[status] || '';
  }

  statusChange(orderId: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const status = target.value;

    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (res) => {
        console.log('Status updated successfully');
        // Update local data
        const order = this.orderData.find(o => o.orderId === orderId);
        if (order) {
          order.status = status;
        }
      },
      error: (err) => {
        console.error('Failed to update status', err);
        alert('Failed to update order status: ' + (err.message || 'Unknown error'));
      }
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
