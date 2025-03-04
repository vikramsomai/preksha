import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = 'http://localhost:5000/api/upload';
  private baseUrl = environment.apiUrl;
  // BehaviorSubject to store and emit products
  private productsSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Start polling immediately on service initialization
    this.startPolling();
  }

  uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return this.http.post<{ imagePaths: string[] }>(this.apiUrl, formData);
  }

  // Basic method to fetch products once
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/products`);
  }

  // Fetch a single product by ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/products/${id}`);
  }

  // Delete product and update the BehaviorSubject immediately
  deleteProductById(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/api/products/${id}`).pipe(
      tap(() => {
        const currentProducts = this.productsSubject.value;
        const updatedProducts = currentProducts.filter(
          (product) => product.productId !== id // or product._id if needed
        );
        console.log('Updated products after deletion:', updatedProducts);
        this.productsSubject.next(updatedProducts);
      })
    );
  }

  // Polling method: Fetch products every interval (default 5 seconds)
  startPolling(intervalMs: number = 5000): void {
    timer(0, intervalMs)
      .pipe(switchMap(() => this.getProducts()))
      .subscribe({
        next: (products) => {
          // Update the BehaviorSubject with the latest products
          this.productsSubject.next(products);
        },
        error: (err) => console.error('Polling error:', err),
      });
  }

  // Add product and update the products subject
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/product`, product).pipe(
      tap((newProduct) => {
        const currentProducts = this.productsSubject.value;
        this.productsSubject.next([...currentProducts, newProduct]);
      })
    );
  }

  // Update product and update the products subject
  updateProduct(productId: string, product: any): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/api/products/${productId}`, product)
      .pipe(
        tap((updatedProduct) => {
          const currentProducts = this.productsSubject.value;
          const index = currentProducts.findIndex(
            (p) => p.productId === productId
          );
          if (index > -1) {
            currentProducts[index] = updatedProduct;
            this.productsSubject.next([...currentProducts]);
          }
        })
      );
  }
}
