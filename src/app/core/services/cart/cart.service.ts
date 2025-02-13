import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  product: any; // Reference to the product
  quantity: number; // Quantity of the product in the cart
  selectedColor: string; // Selected color
  selectedSize: string; // Selected size
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'cart'; // Key for localStorage
  private baseUrl = 'http://localhost:5000/api';
  private cartSource = new BehaviorSubject<CartItem[]>(
    this.getCartFromLocalStorage()
  );
  cart$ = this.cartSource.asObservable();

  constructor(private http: HttpClient) {}

  // Add a product to the cart without replacing other variants
  addToCart(
    product: any,
    quantity: number,
    selectedColor: string,
    selectedSize: string
  ): void {
    const currentCart = this.cartSource.getValue();

    // Check if the exact product variant (ID + size + color) exists in the cart
    const existingCartItemIndex = currentCart.findIndex(
      (item) =>
        item.product.productId === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (existingCartItemIndex > -1) {
      // Update quantity if the product variant already exists
      const updatedCart = [...currentCart];
      updatedCart[existingCartItemIndex].quantity += quantity;
      this.updateCart(updatedCart);
    } else {
      // Add a new entry for this specific product variant
      const newCartItem: CartItem = {
        product,
        quantity,
        selectedColor,
        selectedSize,
      };
      this.updateCart([...currentCart, newCartItem]);
    }
  }

  // Remove a product variant from the cart
  removeFromCart(
    productId: string,
    selectedColor: string,
    selectedSize: string
  ): void {
    const currentCart = this.cartSource.getValue();
    const updatedCart = currentCart.filter(
      (item) =>
        !(
          item.product.productId === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
        )
    );
    this.updateCart(updatedCart);
  }

  // Update quantity of a specific product variant in the cart
  updateCartItemQuantity(
    productId: number,
    selectedColor: string,
    selectedSize: string,
    quantity: number
  ): void {
    const currentCart = this.cartSource.getValue();
    const updatedCart = currentCart.map((item) =>
      item.product.productId === productId &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
        ? { ...item, quantity }
        : item
    );
    this.updateCart(updatedCart);
  }

  // Clear the entire cart
  clearCart(): void {
    this.updateCart([]);
  }

  // Update cart in BehaviorSubject and localStorage
  private updateCart(updatedCart: CartItem[]): void {
    this.cartSource.next(updatedCart);
    localStorage.setItem(this.cartKey, JSON.stringify(updatedCart));
  }

  // Retrieve cart from localStorage
  private getCartFromLocalStorage(): CartItem[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  // Check if a specific product variant is in the cart
  isInCart(
    productId: number,
    selectedColor: string,
    selectedSize: string
  ): boolean {
    const currentCart = this.cartSource.getValue();
    return currentCart.some(
      (item) =>
        item.product.productId === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );
  }

  // Get the total count of items in the cart
  getTotalItems(): number {
    const currentCart = this.cartSource.getValue();
    return currentCart.reduce((total, item) => total + item.quantity, 0);
  }

  // Get the total cost of items in the cart
  getTotalCost(): number {
    const currentCart = this.cartSource.getValue();
    return currentCart.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );
  }
  getCartProducts(productIds: string[]): Observable<any> {
    return this.http.post('${/get-cart-products', { productIds });
  }
  // Retrieve cart from localStorage
  public getCartFromLocalStorages(): CartItem[] {
    const cart = localStorage.getItem(this.cartKey); // `cartKey` is the key for localStorage
    return cart ? JSON.parse(cart) : []; // Parse the JSON string or return an empty array
  }
}
