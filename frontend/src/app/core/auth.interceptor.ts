import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.apiUrl)) return next.handle(request);

    let headers = request.headers.set('Accept', 'application/json');
    if (this.auth.token) headers = headers.set('Authorization', `Bearer ${this.auth.token}`);

    const protectedRequest = !request.url.endsWith('/login') && !request.url.endsWith('/register');
    return next.handle(request.clone({ headers })).pipe(
      catchError((error: HttpErrorResponse) => {
       if (protectedRequest && error.status === 401) {
  this.auth.clearLocalSession();
  void this.router.navigateByUrl('/login', { replaceUrl: true });
}
        return throwError(() => error);
      })
    );
  }
}
