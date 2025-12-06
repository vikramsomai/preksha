import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../environments/environment';

interface AdminTokenData {
  role: string;
  username: string;
  exp: number;
  iat: number;
}

interface LoginResponse {
  message: string;
  token: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private baseUrl = environment.apiUrl;
  private authStateSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

  authState$ = this.authStateSubject.asObservable();

  private readonly TOKEN_KEY = 'adminToken';
  private readonly USERNAME_KEY = 'adminUsername';

  constructor(private http: HttpClient) {
    // Check token validity on initialization
    this.checkTokenValidity();
  }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/admin/login`, credentials).pipe(
      tap((response) => {
        this.saveToken(response.token);
        this.saveUsername(credentials.username);
        this.authStateSubject.next(true);
      }),
      catchError(this.handleError)
    );
  }

  // Verify token is still valid with server
  verifyToken(): Observable<{ valid: boolean; admin: { username: string; role: string } }> {
    return this.http.get<{ valid: boolean; admin: { username: string; role: string } }>(
      `${this.baseUrl}/admin/verify`,
      {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      }
    ).pipe(catchError(this.handleError));
  }

  // Logout from server
  serverLogout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/admin/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      }
    ).pipe(
      tap(() => this.logout()),
      catchError((err) => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.authStateSubject.next(true);
  }

  saveUsername(username: string): void {
    localStorage.setItem(this.USERNAME_KEY, username);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    this.authStateSubject.next(false);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<AdminTokenData>(token);

      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }

      // Check if role is admin
      if (decoded.role !== 'admin') {
        this.logout();
        return false;
      }

      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  // Get token expiration time in milliseconds
  getTokenExpiration(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<AdminTokenData>(token);
      return decoded.exp ? decoded.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  // Get remaining token time in minutes
  getRemainingTokenTime(): number {
    const expiration = this.getTokenExpiration();
    if (!expiration) return 0;

    const remaining = expiration - Date.now();
    return Math.max(0, Math.floor(remaining / (1000 * 60)));
  }

  // Check token validity and handle expiration
  private checkTokenValidity(): void {
    if (!this.isAuthenticated()) {
      this.logout();
    }
  }

  // Auto logout when token expires
  setupAutoLogout(): void {
    const expiration = this.getTokenExpiration();
    if (!expiration) return;

    const timeout = expiration - Date.now();
    if (timeout > 0) {
      setTimeout(() => {
        this.logout();
        // Optionally redirect to login page
        window.location.href = '/admin/login';
      }, timeout);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 403) {
        errorMessage = 'Access denied';
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
