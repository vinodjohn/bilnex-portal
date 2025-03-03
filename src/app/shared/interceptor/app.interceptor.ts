import {Injectable} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {AuthService} from "../service/auth.service";
import {StorageService} from "../service/storage.service";
import {EventData} from "../model/EventData";
import {EventBusService} from "../service/event-bus.service";
import {environment} from "../../../environments/environment";

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  private refreshInProgress = false;

  constructor(private sessionService: StorageService, private authenticationService: AuthService,
              private eventDispatcher: EventBusService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.getLoadedRequest(request);

    const modifiedRequest = request.clone({
      withCredentials: true,
    });

    return next.handle(modifiedRequest).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && !request.url.includes('auth/signin') && err.status === 401) {
          return this.process401Error(modifiedRequest, next);
        }

        return throwError(() => err);
      })
    );
  }

  private process401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.getLoadedRequest(request);

    if (!this.refreshInProgress) {
      this.refreshInProgress = true;

      if (this.sessionService.isLoggedIn()) {
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
    }

    return next.handle(request);
  }

  private getLoadedRequest(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      url: environment.baseURL + request.url,
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }
}

export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true},
];
