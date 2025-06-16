import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const EXCLUDED_URL_SNIPPETS = [
  '/pam/register',
  '/gateway/login'
];

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const shouldExclude = EXCLUDED_URL_SNIPPETS.some(urlSnip => req.url.includes(urlSnip));
    if (shouldExclude) {
      return next.handle(req);
    }

    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${jwt}`
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}