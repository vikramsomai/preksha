import { Component, OnInit } from '@angular/core';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { OrdersService } from '../../core/services/orders/orders.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { DatePipe, CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [SiteHeaderComponent, FooterComponent, DatePipe, DecimalPipe, RouterLink, CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  orderData: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private orderService: OrdersService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Please login to view your orders';
      this.isLoading = false;
      return;
    }

    this.orderService.getProductsById(userId).subscribe({
      next: (res) => {
        // Handle both response formats
        this.orderData = res.orders || res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.errorMessage = err.message || 'Failed to load orders';
        this.isLoading = false;
      }
    });
  }
}
