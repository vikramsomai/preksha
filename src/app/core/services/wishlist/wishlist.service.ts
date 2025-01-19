import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  name: string;
  price: string;
  sizes: string[];
  colors: {
    name: string;
    image: string;
    hoverImage: string;
  }[];
  id: number; // Assuming each product has a unique ID
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistKey = 'wishlist'; // Key for localStorage
  private wishlistSource = new BehaviorSubject<Product[]>(
    this.getWishlistFromLocalStorage()
  );
  wishlist$ = this.wishlistSource.asObservable();

  constructor() {}

  // Add a product to the wishlist
  addToWishlist(product: Product): void {
    const currentWishlist = this.wishlistSource.getValue();

    // Check if the product is already in the wishlist
    const isAlreadyInWishlist = currentWishlist.some(
      (item) => item.id === product.id
    );

    if (!isAlreadyInWishlist) {
      const updatedWishlist = [...currentWishlist, product];
      this.updateWishlist(updatedWishlist);
    }
  }

  // Remove a product from the wishlist by its ID
  removeFromWishlist(productId: number): void {
    const currentWishlist = this.wishlistSource.getValue();
    const updatedWishlist = currentWishlist.filter(
      (product) => product.id !== productId
    );
    this.updateWishlist(updatedWishlist);
  }

  // Clear the entire wishlist
  clearWishlist(): void {
    this.updateWishlist([]);
  }

  // Update wishlist in BehaviorSubject and localStorage
  private updateWishlist(updatedWishlist: Product[]): void {
    this.wishlistSource.next(updatedWishlist);
    localStorage.setItem(this.wishlistKey, JSON.stringify(updatedWishlist));
  }

  // Retrieve wishlist from localStorage
  public getWishlistFromLocalStorage(): Product[] {
    const wishlist = localStorage.getItem(this.wishlistKey);
    return wishlist ? JSON.parse(wishlist) : [];
  }

  // Check if a product is in the wishlist
  isInWishlist(productId: number): boolean {
    const currentWishlist = this.wishlistSource.getValue(); // Check in BehaviorSubject data
    return currentWishlist.some((product) => product.id === productId);
  }
}
