import {Component, ViewEncapsulation} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {NgIf} from '@angular/common';

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
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email: string = '';
  showInfoBox = false;
  showContinueButton = false;
  isEmailAlreadyExists = false;
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
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
      if (!this.email.trim() && !this.isEmailAlreadyExists) {
        this.showInfoBox = false;
        this.showContinueButton = false;
      }
    }, 200);
  }

  onSubmit() {
    if (this.isEmailAlreadyExists) {
      this.router.navigate(['/auth/signin'], {state: {email: this.signUpForm.value.email}});
    } else {
      this.router.navigate(['/auth/verify-email']);
    }

    console.log('Form Submitted:', this.email);
  }
}
