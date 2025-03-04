import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgOtpInputComponent} from 'ng-otp-input';
import {NgClass} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/service/auth.service';
import {SignUp} from '../../shared/model/SignUp';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageService} from '../../shared/service/storage.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
  imports: [
    NgOtpInputComponent,
    NgClass,
    TranslatePipe
  ],
  encapsulation: ViewEncapsulation.None
})
export class VerifyEmailComponent implements OnInit {
  timer: number = 300; // 5  minutes
  resendEnabled: boolean = false;
  isOtpComplete: boolean = false;
  isOtpIncorrect: boolean = false;
  enteredOtp: string = '';
  email: string = '';
  errorMessage = '';

  otpConfig = {
    length: 6,
    allowNumbersOnly: true,
    isPasswordInput: false,
    showError: true,
  };

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router,
              private storageService: StorageService) {
  }

  ngOnInit() {
    this.email = this.storageService.getSignUp().email;
    this.startTimer();
  }

  handleOtpChange(otp: string) {
    this.enteredOtp = otp;
    this.isOtpComplete = otp.length === this.otpConfig.length;
  }

  submitOtp() {
    this.authService.verifyEmail(new SignUp(this.email, this.enteredOtp, "", false, null)).subscribe({
      next: () => {
        let signUp = new SignUp(this.email, this.enteredOtp, "", true, null);
        this.storageService.saveSignUp(signUp);

        this.router.navigate(['/auth/register-company']);
      },
      error: (err) => {
        console.error('OTP Verification Failed:', err);
        this.isOtpIncorrect = true;
        this.triggerShakeEffect();
      }
    });
  }

  triggerShakeEffect() {
    const otpContainer = document.querySelector('.otp-container');
    if (otpContainer) {
      otpContainer.classList.add('shake-error');

      setTimeout(() => {
        otpContainer.classList.remove('shake-error');
      }, 400);
    }
  }

  startTimer() {
    this.timer = 300
    this.resendEnabled = false;

    const interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(interval);
        this.resendEnabled = true;
      }
    }, 1000);
  }

  resendOtp() {
    if (this.resendEnabled) {
      this.authService.signUp(new SignUp(this.email, "", "", false, null)).subscribe({
        next: () => {
        },
        error: err => {
          if (err.status === 400) {
            console.log('OTP not received. Person already exists!');
          } else {
            console.log('OTP not received.' + err.error.message);
            this.errorMessage = "Technical error, PLease try again later!";
            this.snackBar.open(this.errorMessage, 'Close', {
              duration: 2000,
              panelClass: ['snackbar-error']
            });
          }
        }
      });

      this.enteredOtp = '';
      this.isOtpComplete = false;
      this.startTimer();
    }
  }

  formatTimer(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
  }
}
