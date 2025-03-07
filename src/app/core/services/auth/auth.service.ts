import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api/auth';
  private otpUrl = 'http://127.0.0.1:5000/api/otp';

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  sendOtp(email: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/otp/send`, {
      email: email,
    });
  }
  verifyOtp(email: any, otp: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/otp/verify`, {
      email: email,
      otp: otp,
    });
  }
  login(user: any): Observable<any> {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/api/auth/login`, user)
      .pipe(
        tap((response) => {
          this.saveToken(response.token);
        })
      );
  }
  refreshToken(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/refresh`,
      {},
      { withCredentials: true }
    );
  }

  // Register Method
  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/register`, user);
  }

  // Save Token to Local Storage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Retrieve Token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Remove Token (Logout)
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Check if User is Authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Retrieve and decode the token
  getUserData(): any {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        console.log('Decoded User Data:', decodedToken);
        return decodedToken;
      } catch (error) {
        console.error('Token decoding error:', error);
        return null;
      }
    }
    return null; // Return null if no token exists
  }
  getUserId(): string | null {
    const userData = this.getUserData();
    return userData ? userData.id : null; // Adjust based on your token's structure
  }
}
