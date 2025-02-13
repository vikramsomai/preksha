import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = 'http://localhost:5000/api/upload';
  private baseUrl = 'http://localhost:5000/api'; // Update backend URL

  constructor(private http: HttpClient) {}

  uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return this.http.post<{ imagePaths: string[] }>(this.apiUrl, formData);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/product`, product);
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products`);
  }

  // Fetch a single product by ID (optional)
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products/${id}`);
  }
  updateProduct(productId: string, formData: any) {
    return this.http.put(`${this.baseUrl}/products/${productId}`, formData);
  }
}
