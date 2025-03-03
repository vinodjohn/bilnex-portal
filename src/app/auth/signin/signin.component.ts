import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

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
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  passwordVisible = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      stayLoggedIn: [false]
    });
  }

  onSubmit() {
    this.router.navigate(['/']);
    console.log('Form Submitted:');
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
      this.signInForm.patchValue({ email: history.state.email });
    }
  }
}
