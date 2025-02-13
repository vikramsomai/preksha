import type { HttpInterceptorFn } from '@angular/common/http';

export const interceptorsInterceptor: HttpInterceptorFn = (req, next) => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('authToken');

  // Clone the request and add the Authorization header if a token exists
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  // If no token, pass the original request
  return next(req);
};
