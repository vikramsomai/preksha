import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseUrl = 'http://localhost:5000/order';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }
  getProductsById(userId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }
  updateOrderStatus(orderId: string, status: string) {
    return this.http.put(`${this.baseUrl}/${orderId}/status`, { status });
  }
  getOrderById(orderId: any) {
    return this.http.get(`${this.baseUrl}/print/${orderId}`);
  }
}
