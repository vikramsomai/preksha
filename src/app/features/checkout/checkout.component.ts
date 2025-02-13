import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { SiteHeaderComponent } from "../../shared/component/site-header/site-header.component";
import { FooterComponent } from "../../shared/component/footer/footer.component";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [SiteHeaderComponent, FooterComponent],
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
