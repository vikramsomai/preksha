// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private backendUrl = 'http://localhost:5000/initiate-payment';
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  initiatePayment(amount: number, order: any) {
    return this.http.post<any>(`${this.baseUrl}/initiate-payment`, {
      amount,
      productId: this.generateCustomTransactionId().toString(),
      order: order,
    });
  }
  codInitiatePayment(order: any) {
    return this.http.post<any>(`${this.baseUrl}/codPayment`, {
      productId: this.generateCustomTransactionId().toString(),
      order: order,
    });
  }
  generateCustomTransactionId() {
    const timestamp = Date.now().toString(); // Current timestamp
    const randomPart = Math.random().toString(36).substring(2, 10); // Random string
    return `TXN-${timestamp}-${randomPart}`; // Combine parts
  }
}
