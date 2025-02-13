import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://127.0.0.1:5000/api/user';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProfile(): Observable<any> {
    const token = this.authService.getToken();
    console.log('Sending Token:', token); // Debugging line

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  updateProfile(profileData: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    return this.http.put(`${this.apiUrl}/profile`, profileData, { headers });
  }
}
