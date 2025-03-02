import {Routes} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {SignupComponent} from './auth/signup/signup.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'signup', component: SignupComponent }
    ]
  },
  { path: '**', redirectTo: '/' }
];
