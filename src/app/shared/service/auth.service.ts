import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SignIn} from '../model/SignIn';
import {Observable} from 'rxjs';
import {SignUp} from '../model/SignUp';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';
import firebase from 'firebase/compat/app';
import {StorageService} from './storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_BASE_URL = 'auth';

  constructor(private http: HttpClient, private afAuth: AngularFireAuth, private router: Router,
              private storageService: StorageService, private snackBar: MatSnackBar) {
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

  public googleLogin() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(async (result) => {
      if (result.user) {
        const idToken = await result.user.getIdToken();
        this.http.post(this.AUTH_BASE_URL.concat('/google-login'), {token: idToken}).subscribe(
          (response: any) => {
            if (response.isNewUser) {
              let signup = new SignUp(response.email, "0", "", true, null);
              this.storageService.saveSignUp(signup);

              this.router.navigate(['/auth/register-company']);
            } else {
              this.signIn(new SignIn(response.email, "!")).subscribe({
                next: data => {
                  this.storageService.savePerson(data);
                  this.router.navigate(['/dashboard']);
                },
                error: err => {
                  this.snackBar.open(err.error.message.concat(" ").concat(err.error.details.map((x: any) => x).join(",")), 'Close', {
                    duration: 2000,
                    panelClass: ['snackbar-error']
                  });
                }
              });
            }
          },
          (error) => console.log('Login failed', error)
        );
      }
    });
  }
}
