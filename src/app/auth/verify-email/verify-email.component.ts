import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgOtpInputComponent} from 'ng-otp-input';
import {NgClass} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

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
  email: string = 'example@example.com';

  otpConfig = {
    length: 6,
    allowNumbersOnly: true,
    isPasswordInput: false,
    showError: true,
  };

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.startTimer();
  }

  handleOtpChange(otp: string) {
    this.enteredOtp = otp;
    this.isOtpComplete = otp.length === this.otpConfig.length;
  }

  submitOtp() {
    console.log('Submitting OTP:', this.enteredOtp);

    this.http.post('/api/verify-otp', {otp: this.enteredOtp}).subscribe(
      (response) => {
        console.log('OTP Verified Successfully:', response);
      },
      (error) => {
        console.error('OTP Verification Failed:', error);
        this.isOtpIncorrect = true;
        setTimeout(() => (this.isOtpIncorrect = false), 1000);
      }
    );
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
      console.log('Resending OTP...');
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
