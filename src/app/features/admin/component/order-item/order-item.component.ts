import { Component } from '@angular/core';
import { OrdersService } from '../../../../core/services/orders/orders.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent {
  orderList: any[] = [];
  constructor(private orderService: OrdersService) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.orderService.getProducts().subscribe((res) => {
      console.log(res);
      this.orderList = res;
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
