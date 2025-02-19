// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private backendUrl = 'http://localhost:5000/initiate-payment';
  constructor(private http: HttpClient) {}
  initiatePayment(amount: number, order: any) {
    return this.http.post<any>(this.backendUrl, {
      amount,
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
