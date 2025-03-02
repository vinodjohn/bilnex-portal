import {Component, ViewEncapsulation} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    RouterLink,
    TranslatePipe
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email: string = '';
  showInfoBox = false;
  showContinueButton = false;

  onFocus() {
    this.showInfoBox = true;
    this.showContinueButton = true;
  }

  onBlur() {
    setTimeout(() => {
      if (!this.email.trim()) {
        this.showInfoBox = false;
        this.showContinueButton = false;
      }
    }, 200);
  }

  onSubmit() {
    console.log('Form Submitted:', this.email);
  }
}
