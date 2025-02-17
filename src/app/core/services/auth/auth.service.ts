import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api/auth';
  private otpUrl = 'http://127.0.0.1:5000/api/otp';

  constructor(private http: HttpClient) {}
  sendOtp(email: any): Observable<any> {
    return this.http.post(`${this.otpUrl}/send`, {
      email: email,
    });
  }
  verifyOtp(email: any, otp: any): Observable<any> {
    return this.http.post(`${this.otpUrl}/verify`, {
      email: email,
      otp: otp,
    });
  }
  login(user: any): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        console.log('Received Token:', response.token); // Debugging
        this.saveToken(response.token);
      })
    );
  }

  // Register Method
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
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
