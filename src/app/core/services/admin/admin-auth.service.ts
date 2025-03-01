import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  // url = 'http://localhost:5000/admin/login';
  baseUrl=environment.apiUrl;
  constructor(private http: HttpClient) {}
  Login(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/login`, user);
  }
  saveToken(token: string): void {
    localStorage.setItem('adminAuthToken', token);
  }

  // Retrieve Token
  getToken(): string | null {
    return localStorage.getItem('adminAuthToken');
  }

  // Remove Token (Logout)
  logout(): void {
    localStorage.removeItem('adminAuthToken');
  }

  // Check if User is Authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
