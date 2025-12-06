import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environments/environment';

export interface UserProfile {
  userId?: string;
  id?: string;
  firstName?: string;
  firstname?: string;
  lastName?: string;
  lastname?: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  province?: string;
}

export interface ProfileUpdateData {
  firstname: string | null | undefined;
  lastname?: string | null | undefined;
  email: string | null | undefined;
  phone?: string | null | undefined;
  address?: string | null | undefined;
  city?: string | null | undefined;
  country?: string | null | undefined;
  province?: string | null | undefined;
  postalCode?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  userId?: string | null;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile | { user: UserProfile } | any>(
      `${this.baseUrl}/api/user/profile`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        // Handle different response formats
        if (response.user) {
          return this.normalizeProfile(response.user);
        }
        return this.normalizeProfile(response);
      }),
      catchError(this.handleError)
    );
  }

  updateProfile(profileData: ProfileUpdateData | any): Observable<{ message: string; user: UserProfile }> {
    return this.http.put<{ message: string; user: UserProfile }>(
      `${this.baseUrl}/api/auth/update`,
      profileData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => ({
        ...response,
        user: response.user ? this.normalizeProfile(response.user) : {} as UserProfile
      })),
      catchError(this.handleError)
    );
  }

  // Change password
  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/api/auth/change-password`,
      { currentPassword, newPassword },
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Normalize profile data to consistent format
  private normalizeProfile(profile: any): UserProfile {
    return {
      userId: profile.userId || profile.id || profile._id,
      firstName: profile.firstName || profile.firstname,
      lastName: profile.lastName || profile.lastname || '',
      email: profile.email,
      phone: profile.phone || profile.phoneNumber || '',
      address: profile.address || '',
      city: profile.city || '',
      country: profile.country || 'Nepal',
      postalCode: profile.postalCode || '',
      province: profile.province || ''
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while processing your request.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = 'Profile not found.';
      } else if (error.status === 409) {
        errorMessage = 'Email is already in use.';
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server.';
      }
    }

    console.error('Profile service error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
