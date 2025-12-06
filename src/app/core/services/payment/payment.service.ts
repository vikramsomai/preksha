import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface PaymentResponse {
  message: string;
  product_id?: string;
  url?: string;
  orderId?: string;
  status?: string;
}

export interface OrderData {
  users: {
    userId: string | null;
    firstName: string | null | undefined;
    lastName?: string | null | undefined;
    email: string | null | undefined;
    phoneNumber: string | null | undefined;
  };
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    size?: string;
  }>;
  totalAmount: number;
  shippingAddress: {
    address: string | null | undefined;
    province: string | null | undefined;
    postalCode?: string | null | undefined;
    city?: string;
  };
  payment?: {
    method: string;
    transactionId: string;
    status: string;
  };
  status?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  initiatePayment(amount: number, order: OrderData): Observable<PaymentResponse> {
    const transactionId = this.generateCustomTransactionId();

    return this.http.post<PaymentResponse>(`${this.baseUrl}/initiate-payment`, {
      amount,
      productId: transactionId,
      order: order,
    }).pipe(
      map(response => {
        // Store transaction ID for verification later
        localStorage.setItem('pendingTransactionId', transactionId);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  codInitiatePayment(order: OrderData): Observable<PaymentResponse> {
    const transactionId = this.generateCustomTransactionId();

    return this.http.post<PaymentResponse>(`${this.baseUrl}/codPayment`, {
      productId: transactionId,
      order: order,
    }).pipe(
      map(response => ({
        ...response,
        orderId: transactionId
      })),
      catchError(this.handleError)
    );
  }

  verifyPayment(productId: string): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.baseUrl}/payment-status`, {
      product_id: productId,
    }).pipe(
      map(response => {
        // Clear pending transaction on successful verification
        if (response.status === 'COMPLETE') {
          localStorage.removeItem('pendingTransactionId');
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getPendingTransactionId(): string | null {
    return localStorage.getItem('pendingTransactionId');
  }

  clearPendingTransaction(): void {
    localStorage.removeItem('pendingTransactionId');
  }

  generateCustomTransactionId(): string {
    const timestamp = Date.now().toString();
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `TXN-${timestamp}-${randomPart}`;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred during payment processing.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.errors) {
        errorMessage = error.error.errors.join(', ');
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.status === 400) {
        errorMessage = 'Invalid order data. Please check your information and try again.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    }

    console.error('Payment error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
