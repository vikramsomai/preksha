import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const interceptorsInterceptor: HttpInterceptorFn = (req, next) => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('authToken');
  const authService = inject(AuthService);
   let cloned=req
  // Clone the request and add the Authorization header if a token exists
  if (token) {
    cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  // If no token, pass the original request
  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403 || error.status === 401) {
        console.log('Token Expired... Calling Refresh Token API 🔥');

        return authService.refreshToken().pipe(
          switchMap((res: any) => {
            console.log('New Token:', res.accessToken);

            localStorage.setItem('authToken', res.accessToken);

            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`,
              },
              withCredentials: true, // CORS Cookie
            });

            return next(newReq);
          }),
          catchError(() => {
            console.log('Refresh Token Expired... Logging Out');
            authService.logout();
            return throwError(() => new Error('Session Expired'));
          })
        );
      }
      return throwError(() => new Error(error.message));
    })
  );
};
