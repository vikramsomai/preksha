import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

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
  private cartKey = 'encryptedCart'; // Key for localStorage
  private secretKey = 'your-secret-key'; // Use a strong secret key
  private cartSource = new BehaviorSubject<any[]>(
    this.getCartFromLocalStorage()
  );
  cart$ = this.cartSource.asObservable();

  constructor(private http: HttpClient) {}

  // Encrypt data
  private encryptData(data: any): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKey
    ).toString();
  }

  // Decrypt data
  private decryptData(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  // Add a product to the cart without replacing other variants
  addToCart(product: any, quantity: number, selectedSize: string): void {
    const currentCart = this.cartSource.getValue();

    // Check if the exact product variant (ID + size + color) exists in the cart
    const existingCartItemIndex = currentCart.findIndex(
      (item) =>
        item.product.productId === product.id &&
        item.selectedSize === selectedSize
    );

    if (existingCartItemIndex > -1) {
      // Update quantity if the product variant already exists
      const updatedCart = [...currentCart];
      updatedCart[existingCartItemIndex].quantity += quantity;
      this.updateCart(updatedCart);
    } else {
      // Add a new entry for this specific product variant
      const newCartItem: any = {
        product,
        quantity,
        selectedSize,
      };
      this.updateCart([...currentCart, newCartItem]);
    }
  }

  // Remove a product variant from the cart
  removeFromCart(productId: string, selectedSize: string): void {
    const currentCart = this.cartSource.getValue();
    const updatedCart = currentCart.filter(
      (item) =>
        !(
          item.product.productId === productId &&
          item.selectedSize === selectedSize
        )
    );
    console.log('update cart', updatedCart);
    this.updateCart(updatedCart);
  }

  // Update quantity of a specific product variant in the cart
  updateCartItemQuantity(
    productId: string,
    selectedSize: string,
    quantity: number
  ): void {
    const currentCart = this.cartSource.getValue();
    const updatedCart = currentCart.map((item) =>
      item.product.productId === productId && item.selectedSize === selectedSize
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
  private updateCart(updatedCart: any[]): void {
    this.cartSource.next(updatedCart);
    const encryptedCart = this.encryptData(updatedCart); // Encrypt before storing
    localStorage.setItem(this.cartKey, encryptedCart);
  }

  // Retrieve cart from localStorage
  private getCartFromLocalStorage(): any[] {
    const encryptedCart = localStorage.getItem(this.cartKey);
    return encryptedCart ? this.decryptData(encryptedCart) : [];
  }

  // Check if a specific product variant is in the cart
  isInCart(productId: string, selectedSize: string): boolean {
    const currentCart = this.cartSource.getValue();
    return currentCart.some(
      (item) =>
        item.product.productId === productId &&
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
      (total, item: any) => total + item.quantity * item.product.price,
      0
    );
  }
  getTotal() {
    let fees = 500;
    const currentCart = this.cartSource.getValue();
    let subTotal = currentCart.reduce(
      (total, item: any) => total + item.quantity * item.product.price,
      0
    );
    return subTotal >= 4000 ? subTotal : subTotal + fees;
  }

  getCartProducts(productIds: string[]): Observable<any> {
    return this.http.post('${/get-cart-products', { productIds });
  }
}
