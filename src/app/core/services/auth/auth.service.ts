import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../environments/environment';

export interface UserData {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export interface LoginResponse {
  message: string;
  token: string;
  user?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private authStateSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

  authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check token validity on service initialization
    this.checkTokenValidity();
  }

  // OTP Methods
  sendOtp(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/api/otp/send`, {
      email: email.toLowerCase().trim(),
    }).pipe(catchError(this.handleError));
  }

  verifyOtp(email: string, otp: string): Observable<{ message: string; verified: boolean }> {
    return this.http.post<{ message: string; verified: boolean }>(`${this.baseUrl}/api/otp/verify`, {
      email: email.toLowerCase().trim(),
      otp: otp,
    }).pipe(catchError(this.handleError));
  }

  // Login Method
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/api/auth/login`, {
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password
      })
      .pipe(
        tap((response) => {
          this.saveToken(response.token);
          this.authStateSubject.next(true);
        }),
        catchError(this.handleError)
      );
  }

  // Register Method
  register(user: {
    firstname: string;
    lastname?: string;
    email: string;
    password: string
  }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/api/auth/register`, {
      ...user,
      email: user.email.toLowerCase().trim(),
      firstname: user.firstname.trim(),
      lastname: user.lastname?.trim() || ''
    }).pipe(catchError(this.handleError));
  }

  // Forgot password
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/api/auth/forgot-password`, {
      email: email.toLowerCase().trim()
    }).pipe(catchError(this.handleError));
  }

  // Reset password
  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/api/auth/reset-password`, {
      token,
      newPassword
    }).pipe(catchError(this.handleError));
  }

  // Change password (for authenticated users)
  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/api/auth/change-password`, {
      currentPassword,
      newPassword
    }).pipe(catchError(this.handleError));
  }

  // Get current user profile
  getCurrentUser(): Observable<{ user: UserData }> {
    return this.http.get<{ user: UserData }>(`${this.baseUrl}/api/auth/me`).pipe(
      catchError(this.handleError)
    );
  }

  // Refresh Token
  refreshToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.baseUrl}/api/auth/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap((response) => {
        this.saveToken(response.token);
      }),
      catchError(this.handleError)
    );
  }

  // Save Token to Local Storage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.authStateSubject.next(true);
  }

  // Retrieve Token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Remove Token (Logout)
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.authStateSubject.next(false);
  }

  // Check if User is Authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<UserData>(token);
      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  // Check token validity and logout if expired
  private checkTokenValidity(): void {
    if (!this.isAuthenticated()) {
      this.logout();
    }
  }

  // Retrieve and decode the token
  getUserData(): UserData | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken = jwtDecode<UserData>(token);

      // Check if token is expired
      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        this.logout();
        return null;
      }

      return decodedToken;
    } catch (error) {
      console.error('Token decoding error:', error);
      return null;
    }
  }

  // Get user ID from token
  getUserId(): string | null {
    const userData = this.getUserData();
    return userData?.id || null;
  }

  // Get user email from token
  getUserEmail(): string | null {
    const userData = this.getUserData();
    return userData?.email || null;
  }

  // Get user role from token
  getUserRole(): string | null {
    const userData = this.getUserData();
    return userData?.role || 'user';
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  // Error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error?.error) {
        errorMessage = error.error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.details) {
        errorMessage = error.error.details;
      } else if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 409) {
        errorMessage = 'Email already registered';
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
