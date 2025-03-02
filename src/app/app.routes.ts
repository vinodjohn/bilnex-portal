import {Routes} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {SignupComponent} from './auth/signup/signup.component';
import {VerifyEmailComponent} from './auth/verify-email/verify-email.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'signup', component: SignupComponent },
      { path: 'verify-email', component: VerifyEmailComponent }
    ]
  },
  { path: '**', redirectTo: '/' }
];
