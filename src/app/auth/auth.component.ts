import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {httpInterceptorProviders} from '../shared/interceptor/app.interceptor';

@Component({
  selector: 'app-auth',
  imports: [
    RouterOutlet
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

}
