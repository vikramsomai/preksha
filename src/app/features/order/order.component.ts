import { Component } from '@angular/core';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { OrdersService } from '../../core/services/orders/orders.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [SiteHeaderComponent, FooterComponent, DatePipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  orderData: any[] = [];
  constructor(
    private orderService: OrdersService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.orderService
      .getProductsById(this.authService.getUserId())
      .subscribe((res) => {
        this.orderData = res;
        console.log('user order data', res);
      });
  }
}
