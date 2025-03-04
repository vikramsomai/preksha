import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  // private baseUrl = 'http://localhost:5000/order';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/order/all`);
  }
  getProductsById(userId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/order/${userId}`);
  }
  updateOrderStatus(orderId: string, status: string) {
    return this.http.put(`${this.baseUrl}/order/${orderId}/status`, { status });
  }
  getOrderById(orderId: any) {
    return this.http.get(`${this.baseUrl}/order/print/${orderId}`);
  }
  getTopselling(): Observable<any> {
    return this.http.get(`${this.baseUrl}/order/top/top-selling`);
  }
}
