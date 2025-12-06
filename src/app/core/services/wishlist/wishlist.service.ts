import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface WishlistItem {
  productId: {
    _id: string;
    productName: string;
    price: number;
    imageUrls: string[];
    category: string;
    subcategory: string;
    stock: number;
    isActive: boolean;
  } | null;
  addedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/wishlist`;

  private wishlistKey = 'wishlist'; // Key for localStorage
  private wishlistSource = new BehaviorSubject<any[]>(
    this.getWishlistFromLocalStorage()
  );
  wishlist$ = this.wishlistSource.asObservable();

  private wishlistCountSubject = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCountSubject.asObservable();

  private wishlistIdsSubject = new BehaviorSubject<Set<string>>(new Set());

  constructor() {
    // Initialize count from localStorage
    this.wishlistCountSubject.next(this.wishlistSource.value.length);
    this.updateWishlistIds();
  }

  private isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private updateWishlistIds(): void {
    const ids = new Set(this.wishlistSource.value.map((p: any) => p.productId || p._id));
    this.wishlistIdsSubject.next(ids);
  }

  // Load wishlist from API (for logged-in users)
  loadFromApi(): Observable<any> {
    if (!this.isLoggedIn()) {
      return of({ success: false });
    }

    return this.http.get<any>(this.apiUrl).pipe(
      tap((response) => {
        if (response.success) {
          const items = response.wishlist.map((item: WishlistItem) => ({
            productId: item.productId?._id,
            ...item.productId
          })).filter((item: any) => item.productId);

          this.wishlistSource.next(items);
          this.wishlistCountSubject.next(response.count);
          this.updateWishlistIds();
          localStorage.setItem(this.wishlistKey, JSON.stringify(items));
        }
      }),
      catchError(() => of({ success: false }))
    );
  }

  // Add a product to the wishlist
  addToWishlist(product: any): void {
    const currentWishlist = this.wishlistSource.getValue();

    // Check if the product is already in the wishlist
    const isAlreadyInWishlist = currentWishlist.some(
      (item) => item.productId === product.productId
    );

    if (!isAlreadyInWishlist) {
      const updatedWishlist = [...currentWishlist, product];
      this.updateWishlist(updatedWishlist);

      // Sync to API if logged in
      if (this.isLoggedIn()) {
        this.http.post(`${this.apiUrl}/add`, { productId: product.productId }).subscribe();
      }
    }
  }

  // Add to wishlist with API sync (returns observable)
  addToWishlistApi(productId: string): Observable<any> {
    const product = { productId };
    this.addToWishlist(product);

    if (this.isLoggedIn()) {
      return this.http.post(`${this.apiUrl}/add`, { productId });
    }
    return of({ success: true, message: 'Added to local wishlist' });
  }

  // Remove a product from the wishlist by its ID
  removeFromWishlist(productId: string): void {
    const currentWishlist = this.wishlistSource.getValue();
    const updatedWishlist = currentWishlist.filter(
      (product: any) => product.productId !== productId
    );
    this.updateWishlist(updatedWishlist);

    // Sync to API if logged in
    if (this.isLoggedIn()) {
      this.http.delete(`${this.apiUrl}/remove/${productId}`).subscribe();
    }
  }

  // Remove with API sync (returns observable)
  removeFromWishlistApi(productId: string): Observable<any> {
    this.removeFromWishlist(productId);

    if (this.isLoggedIn()) {
      return this.http.delete(`${this.apiUrl}/remove/${productId}`);
    }
    return of({ success: true, message: 'Removed from local wishlist' });
  }

  // Clear the entire wishlist
  clearWishlist(): void {
    this.updateWishlist([]);

    if (this.isLoggedIn()) {
      this.http.delete(`${this.apiUrl}/clear`).subscribe();
    }
  }

  // Update wishlist in BehaviorSubject and localStorage
  private updateWishlist(updatedWishlist: any[]): void {
    this.wishlistSource.next(updatedWishlist);
    this.wishlistCountSubject.next(updatedWishlist.length);
    this.updateWishlistIds();
    localStorage.setItem(this.wishlistKey, JSON.stringify(updatedWishlist));
  }

  // Retrieve wishlist from localStorage
  public getWishlistFromLocalStorage(): any[] {
    const wishlist = localStorage.getItem(this.wishlistKey);
    return wishlist ? JSON.parse(wishlist) : [];
  }

  // Check if a product is in the wishlist
  isInWishlist(productId: string | number): boolean {
    const idStr = productId.toString();
    return this.wishlistIdsSubject.value.has(idStr);
  }

  // Toggle wishlist status
  toggleWishlist(product: any): Observable<any> {
    const productId = product.productId || product._id;
    if (this.isInWishlist(productId)) {
      return this.removeFromWishlistApi(productId);
    } else {
      return this.addToWishlistApi(productId);
    }
  }

  // Get wishlist count
  getCount(): number {
    return this.wishlistSource.value.length;
  }

  // Reset on logout
  reset(): void {
    this.wishlistSource.next([]);
    this.wishlistCountSubject.next(0);
    this.wishlistIdsSubject.next(new Set());
    localStorage.removeItem(this.wishlistKey);
  }
}
