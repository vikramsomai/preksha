import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = 'http://localhost:5000/api/upload';
  private baseUrl = environment.apiUrl;
  // private baseUrl = 'http://localhost:5000/api';
  private productsSubject = new BehaviorSubject<any[]>([]); // BehaviorSubject for products
  products$ = this.productsSubject.asObservable(); // Expose as observable

  constructor(private http: HttpClient) {}

  uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return this.http.post<{ imagePaths: string[] }>(this.apiUrl, formData);
  }

  // addProduct(product: any): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/product`, product);
  // }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/products`);
  }

  // Fetch a single product by ID (optional)
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products/${id}`);
  }
  // updateProduct(productId: string, formData: any) {
  //   return this.http.put(`${this.baseUrl}/products/${productId}`, formData);
  // }
  fetchProducts(): void {
    this.http.get<any[]>(`${this.baseUrl}/products`).subscribe((products) => {
      this.productsSubject.next(products);
    });
  }

  // Add product and update the products subject
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/product`, product).pipe(
      tap((newProduct) => {
        const currentProducts = this.productsSubject.value;
        this.productsSubject.next([...currentProducts, newProduct]); // Add to the list
      })
    );
  }

  // Update product and update the products subject
  updateProduct(productId: string, product: any): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/products/${productId}`, product)
      .pipe(
        tap((updatedProduct) => {
          const currentProducts = this.productsSubject.value;
          const index = currentProducts.findIndex(
            (p) => p.productId === productId
          );
          if (index > -1) {
            currentProducts[index] = updatedProduct; // Update product in the list
            this.productsSubject.next([...currentProducts]); // Notify subscribers
          }
        })
      );
  }
}
