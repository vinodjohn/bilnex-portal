import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {SignUp} from '../../shared/model/SignUp';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../shared/service/auth.service';

@Component({
  selector: 'app-setup-password',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    TranslatePipe
  ],
  templateUrl: './setup-password.component.html',
  styleUrl: './setup-password.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SetupPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  passwordVisible = false;
  email: string = "";
  signup: SignUp = new SignUp("", "", "", false, null);
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar, private authService: AuthService) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      stayLoggedIn: [false]
    });
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

  onSubmit() {
    if (this.passwordForm.valid) {
      this.signup = new SignUp(this.signup.email, this.signup.code, this.passwordForm.get('password')?.value, this.signup.isVerified, this.signup.company);

      console.log(this.signup);

      this.authService.signUpConfirm(this.signup).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/auth/signin'], {state: {email: this.signup.email}});
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.loading = false;

          this.snackBar.open(this.errorMessage, 'Close', {
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

  ngOnInit(): void {
    this.signup = history.state.signup;
    this.email = this.signup.email;
  }
}
