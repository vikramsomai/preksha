import { Component } from '@angular/core';
import { OrdersService } from '../../../../core/services/orders/orders.service';
import { ProductService } from '../../../../core/services/product/product.service';
import { UploadService } from '../add-item/upload.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  orderData: any[] = [];
  productData: any[] = [];
  topSelling:any;
  constructor(
    private orderService: OrdersService,
    private productService: UploadService
  ) {}
  ngOnInit(): void {
    this.orderService.getProducts().subscribe((res) => {
      this.orderData = res;
    });

    this.productService.getProducts().subscribe((res) => {
      res.map((product) => {
        this.productData.push(product);
      });
    });
    this.getTopSelling();
  }
  getTotalOrders() {
    return this.orderData.length;
  }
  getTotalOrderAmount() {
    return this.orderData.reduce((sum, item) => (sum += item.totalAmount), 0);
  }
  getTotalStock() {
    return this.productData.reduce((sum, item) => (sum += item.qty), 0);
  }
  getTopSelling() {
    this.orderService.getTopselling().subscribe((res)=>{
      this.topSelling=res
    })
  }
  statusChange(orderId: any, event: any) {
    const status = event.target.value;
    this.orderService.updateOrderStatus(orderId, status).subscribe((res) => {
    });
  }
}
