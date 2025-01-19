import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  // Login method
  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, user);
  }

  // Register method
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  // // Get the current user
  // getCurrentUser(): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.getToken()}`,
  //   });
  //   return this.http.get(`${this.apiUrl}/auth/me`, { headers });
  // }

  // // Save token to local storage
  // saveToken(token: string): void {
  //   localStorage.setItem('authToken', token);
  // }

  // // Retrieve token from local storage
  // getToken(): string | null {
  //   return localStorage.getItem('authToken');
  // }

  // // Remove token from local storage
  // logout(): void {
  //   localStorage.removeItem('authToken');
  // }

  // // Check if the user is authenticated
  // isAuthenticated(): boolean {
  //   return !!this.getToken();
  // }
}
