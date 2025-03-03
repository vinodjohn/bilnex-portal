import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {NgIf} from '@angular/common';
import {StorageService} from '../../shared/service/storage.service';
import {AuthService} from '../../shared/service/auth.service';
import {SignUp} from '../../shared/model/SignUp';
import {MatSnackBar} from '@angular/material/snack-bar';
import {httpInterceptorProviders} from '../../shared/interceptor/app.interceptor';

@Component({
  selector: 'app-signup',
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    RouterLink,
    TranslatePipe,
    ReactiveFormsModule,
    NgIf
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  providers: [httpInterceptorProviders]
})
export class SignupComponent implements AfterViewInit {
  email: string = '';
  showInfoBox = false;
  showContinueButton = false;
  isEmailAlreadyExists = false;
  signUpForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private storageService: StorageService,
              private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onFocus() {
    this.showInfoBox = true;
    this.showContinueButton = true;
  }

  onBlur() {
    setTimeout(() => {
      if (!this.email.trim() && !this.isEmailAlreadyExists && !this.signUpForm.valid) {
        this.showInfoBox = false;
        this.showContinueButton = false;
      }
    }, 200);
  }

  onSubmit() {
    if (this.isEmailAlreadyExists) {
      this.router.navigate(['/auth/signin'], {state: {email: this.signUpForm.value.email}});
    } else {
      if (this.signUpForm.valid) {
        this.loading = true;
        this.authService.signUp(new SignUp(this.signUpForm.get('email')?.value, "", "", false, null)).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/auth/verify-email'], {state: {email: this.signUpForm.value.email}});
          },
          error: err => {
            if (err.status === 400) {
              this.isEmailAlreadyExists = true;
              this.showInfoBox = true;
            } else {
              this.errorMessage = err.error.message;
              this.loading = false;

              this.snackBar.open(this.errorMessage, 'Close', {
                duration: 2000,
                panelClass: ['snackbar-error']
              });
            }
          }
        });
      } else {
        this.snackBar.open('Please fix the errors in the form', 'Close', {
          duration: 2000,
          panelClass: ['snackbar-error']
        });
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
}
