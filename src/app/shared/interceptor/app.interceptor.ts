import {Injectable} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {AuthService} from '../service/auth.service';
import {StorageService} from '../service/storage.service';
import {EventData} from '../model/EventData';
import {EventBusService} from '../service/event-bus.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  private refreshInProgress = false;

  constructor(
    private sessionService: StorageService,
    private authenticationService: AuthService,
    private eventDispatcher: EventBusService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('/assets/i18n/') || request.url.includes('/assets/')) {
      return next.handle(request);
    }

    if (!request.url.startsWith('http')) {
      request = request.clone({
        url: `${environment.baseURL}${request.url}`,
        setHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true,
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && !request.url.includes('auth/sign-in') && err.status === 401) {
          return this.process401Error(request, next);
        }
        return throwError(() => err);
      })
    );
  }

  private process401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshInProgress && this.sessionService.isLoggedIn()) {
      this.refreshInProgress = true;

      return this.authenticationService.refreshToken().pipe(
        switchMap(() => {
          this.refreshInProgress = false;
          return next.handle(request);
        }),
        catchError((err) => {
          this.refreshInProgress = false;
          if (err.status === 403) {
            this.eventDispatcher.emit(new EventData('sign-out', null));
          }
          return throwError(() => err);
        })
      );
    }

    return next.handle(request);
  }
}

export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true},
];
