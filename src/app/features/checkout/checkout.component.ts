import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cartlist!: any[];
  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe((items) => {
      this.cartlist = items;
    });
  }
}
