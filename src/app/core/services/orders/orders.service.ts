import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Order {
  orderId: string;
  user: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    size: string;
  }>;
  totalAmount: number;
  payment: {
    method: string;
    transactionId: string;
    status: string;
    paidAt?: Date;
  };
  shippingAddress: {
    address: string;
    province: string;
    postalCode: string;
    city?: string;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrdersResponse {
  orders: Order[];
  count: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderStats {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
  byStatus: { [key: string]: number };
  byPaymentMethod: { [key: string]: number };
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Admin: Get all orders with pagination
  getProducts(page: number = 1, limit: number = 50, status?: string): Observable<OrdersResponse> {
    let url = `${this.baseUrl}/order/all?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    return this.http.get<OrdersResponse>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Get orders for a specific user
  getProductsById(userId: string): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.baseUrl}/order/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Admin: Update order status
  updateOrderStatus(orderId: string, status: string): Observable<{ success: boolean; order: Order }> {
    return this.http.put<{ success: boolean; order: Order }>(
      `${this.baseUrl}/order/${orderId}/status`,
      { status },
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get single order by ID (for invoice/print)
  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/order/print/${orderId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get top selling product(s)
  getTopselling(limit: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/order/top/top-selling?limit=${limit}`).pipe(
      catchError(this.handleError)
    );
  }

  // Admin: Get order statistics
  getOrderStats(): Observable<OrderStats> {
    return this.http.get<OrderStats>(`${this.baseUrl}/order/stats`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Admin: Get recent orders
  getRecentOrders(limit: number = 10): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.baseUrl}/order/recent?limit=${limit}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Admin: Get pending orders count
  getPendingOrdersCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/order/pending-count`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Admin: Get orders by status
  getOrdersByStatus(status: string): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.baseUrl}/order/status/${encodeURIComponent(status)}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while processing your request.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = 'Order not found.';
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server.';
      }
    }

    console.error('Order service error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
