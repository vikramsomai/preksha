import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../features/admin/component/add-item/product.model';
import { environment } from '../../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'your-api-endpoint';
  // private baseUrl = 'http://localhost:5000/api';
  baseUrl=environment.apiUrl
  constructor(private http: HttpClient) {}

  addProduct(product: Product): Observable<any> {
    return this.http.post(`${this.baseUrl}/api`, product);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
