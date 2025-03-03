import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../../core/services/orders/orders.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-print-invoice',
  standalone: true,
  imports: [DatePipe,MatButtonModule],
  templateUrl: './print-invoice.component.html',
  styleUrl: './print-invoice.component.scss',
})
export class PrintInvoiceComponent {
  order: any[] = []; // or create a proper interface
  ordersData: any;
  dateToday = new Date();
  email = 'prekshaaclothing@gmail.com';
  constructor(
    private route: ActivatedRoute,
    public orderService: OrdersService
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe((data) => {
        this.order.push({ ...data });
        console.log('print data', this.order);
        this.ordersData = this.order[0][0];
      });
    }
  }
  getSubTotal() {
    return this.ordersData.products.reduce(
      (sum: any, item: any) => (sum += item.price * item.quantity),
      0
    );
  }
  printInvoice() {
    window.print();
  }
  generateInvoiceNumber() {
    const orderNumber = this.ordersData.orderId;
    // Extract numeric part from the order number
    const match = orderNumber.match(/\d+/);
    if (match) {
      const numericPart = match[0];
      return `INV-${numericPart}`;
    }
    return 'Invalid Order Number';
  }
}
