import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {StorageService} from '../../shared/service/storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../shared/service/auth.service';
import {SignIn} from '../../shared/model/SignIn';

@Component({
  selector: 'app-signin',
  imports: [
    FormsModule,
    RouterLink,
    MatFormField,
    MatInput,
    MatIconButton,
    MatLabel,
    MatSuffix,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SigninComponent implements OnInit, AfterViewInit {
  signInForm: FormGroup;
  passwordVisible = false;
  loading = false;
  isSignedIn = false;
  isSignInFailed = false;
  roles: string = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router, private storageService: StorageService,
              private snackBar: MatSnackBar, private authService: AuthService) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      stayLoggedIn: [false]
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {
      this.loading = true;

      this.authService.signIn(new SignIn(this.signInForm.get('email')?.value, this.signInForm.get('password')?.value)).subscribe({
        next: data => {
          this.storageService.savePerson(data);
          this.loading = false;
          this.isSignInFailed = false;
          this.isSignedIn = true;
          this.roles = this.storageService.getPerson().roles;
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isSignInFailed = true;
          this.loading = false;

          this.snackBar.open(this.errorMessage.concat(" ").concat(err.error.details.map((x: any) => x).join(",")), 'Close', {
            duration: 2000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      this.snackBar.open('Please fix the errors in the form', 'Close', {
        duration: 2000,
        panelClass: ['snackbar-error']
      });
    }
  }

  passwordValidator(control: any) {
    const value = control.value || '';
    return /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value)
      ? null
      : {passwordStrength: true};
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  ngOnInit(): void {
    console.log(history.state.email);

    if (history.state && history.state.email) {
      this.signInForm.patchValue({email: history.state.email});
    }
  }

  ngAfterViewInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }
}
