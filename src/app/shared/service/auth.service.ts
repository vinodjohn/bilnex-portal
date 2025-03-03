import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SignIn} from '../model/SignIn';
import {Observable} from 'rxjs';
import {SignUp} from '../model/SignUp';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_BASE_URL = 'auth';

  constructor(private http: HttpClient) {
  }

  public signIn(signIn: SignIn): Observable<any> {
    return this.http.post(this.AUTH_BASE_URL.concat('/sign-in'), signIn);
  }

  public signUp(signUp: SignUp): Observable<any> {
    return this.http.post(this.AUTH_BASE_URL.concat('/sign-up'), signUp);
  }

  public verifyEmail(signUp: SignUp): Observable<any> {
    return this.http.post(this.AUTH_BASE_URL.concat('/verify-email'), signUp);
  }

  public signUpConfirm(signUp: SignUp): Observable<any> {
    return this.http.post(this.AUTH_BASE_URL.concat('/sign-up-confirm'), signUp);
  }

  public refreshToken() {
    return this.http.post(this.AUTH_BASE_URL.concat('/refresh-token'), null);
  }

  public signOut(): Observable<any> {
    return this.http.post(this.AUTH_BASE_URL.concat('/sign-out'), null);
  }
}
