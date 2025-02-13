import { Component } from '@angular/core';
import { SiteHeaderComponent } from '../../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../../shared/component/footer/footer.component';
import { CartService } from '../../../core/services/cart/cart.service';
import { RouterModule } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    FooterComponent,
    RouterModule,
    JsonPipe,
    FormsModule,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  cartlist!: any[];

  constructor(public cartService: CartService) {
    this.cartService.cart$.subscribe((items) => {
      this.cartlist = items;
    });
  }

  getSubTotal() {
    return this.cartlist.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  addQuantity(index: number) {
    if (this.cartlist[index].quantity < 5) {
      this.cartlist[index].quantity++;
    }
  }

  decreaseQuantity(index: number) {
    if (this.cartlist[index].quantity > 1) {
      this.cartlist[index].quantity--;
    }
  }
  updateQunatity(action: string, product: any, qty: number) {
    if (action === 'add') {
      qty = qty + 1;
      this.cartService.updateCartItemQuantity(
        product.product.id,
        product.product.selectedColor,
        product.product.selectedSize,
        qty
      );
    } else if (action === 'delete' && qty > 1) {
      qty = qty - 1;
      this.cartService.updateCartItemQuantity(
        product.product.id,
        product.product.selectedColor,
        product.product.selectedSize,
        qty
      );
    }
  }
  removeCartItem(item: any) {
    const product = item.product;
    console.log(product);
    this.cartService.removeFromCart(
      product.id,
      product.selectedColor,
      product.selectedSize
    );
  }
}
