import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'cart'; // Key for localStorage
  private cartSource = new BehaviorSubject<any[]>(
    this.getCartFromLocalStorage()
  );
  cart$ = this.cartSource.asObservable();

  constructor() {}

  // Add a product to the cart
  addToCart(product: any, quantity: number = 1): void {
    const currentCart = this.cartSource.getValue();

    // Check if the product is already in the cart
    const cartItemIndex = currentCart.findIndex(
      (item) => item.product.id === product.id
    );

    if (cartItemIndex > -1) {
      // If the product is already in the cart, update its quantity
      const updatedCart = [...currentCart];
      updatedCart[cartItemIndex].quantity += quantity;
      this.updateCart(updatedCart);
    } else {
      // Add a new product to the cart
      const updatedCart = [...currentCart, { product, quantity }];
      this.updateCart(updatedCart);
    }
  }

  // Remove a product from the cart by its ID
  removeFromCart(productId: number): void {
    const currentCart = this.cartSource.getValue();
    const updatedCart = currentCart.filter(
      (item) => item.product.id !== productId
    );
    this.updateCart(updatedCart);
  }

  // Update the quantity of a product in the cart
  updateCartItemQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSource.getValue();
    const updatedCart = currentCart.map((item) =>
      item.product.id === productId ? { ...item, quantity: quantity } : item
    );
    this.updateCart(updatedCart);
  }

  // Clear the entire cart
  clearCart(): void {
    this.updateCart([]);
  }

  // Update cart in BehaviorSubject and localStorage
  private updateCart(updatedCart: any[]): void {
    this.cartSource.next(updatedCart);
    localStorage.setItem(this.cartKey, JSON.stringify(updatedCart));
  }

  // Retrieve cart from localStorage
  public getCartFromLocalStorage(): any[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  // Check if a product is in the cart
  isInCart(productId: number): boolean {
    const currentCart = this.cartSource.getValue();
    return currentCart.some((item) => item.product.id === productId);
  }

  // Get the total count of items in the cart
  public getTotalItems(): number {
    const currentCart = this.cartSource.getValue();
    return currentCart.reduce((total, item) => total + item.quantity, 0);
  }

  // Get the total cost of items in the cart
  getTotalCost(): number {
    const currentCart = this.cartSource.getValue();
    return currentCart.reduce(
      (total, item) =>
        total +
        item.quantity *
          parseFloat(item.product.price.replace('NPR. ', '').replace(',', '')),
      0
    );
  }
}
