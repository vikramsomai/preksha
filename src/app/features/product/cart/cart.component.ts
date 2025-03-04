import { Component } from '@angular/core';
import { SiteHeaderComponent } from '../../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../../shared/component/footer/footer.component';
import { CartService } from '../../../core/services/cart/cart.service';
import { RouterLink, RouterModule } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    FooterComponent,
    RouterModule,
    RouterLink,
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
      console.log('cart data', this.cartlist);
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
  updateQunatity(action: string, item: any): void {
    const currentQuantity = item.quantity;
    let updatedQuantity = currentQuantity;

    if (action === 'add') {
      updatedQuantity++;
    } else if (action === 'delete' && currentQuantity > 1) {
      updatedQuantity--;
    }

    this.cartService.updateCartItemQuantity(
      item.product.productId,
      item.selectedSize,
      updatedQuantity
    );
  }
  removeCartItem(item: any) {
    const product = item.product;
    this.cartService.removeFromCart(product.productId, product.selectedSize);
  }
}
