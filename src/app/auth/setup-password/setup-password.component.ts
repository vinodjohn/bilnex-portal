import {Component, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {Router} from '@angular/router';

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
export class SetupPasswordComponent {
  passwordForm: FormGroup;
  passwordVisible = false;
  email: string = "example@example.com";

  constructor(private fb: FormBuilder, private router: Router) {
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
    this.router.navigate(['/auth/signin']);
    // if (this.passwordForm.valid) {
    //   console.log('Password set:', this.passwordForm.value);
    // }
  }
}
