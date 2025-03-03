import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {NgIf} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LanguageModalComponent} from './language-modal/language-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconButton,
    MatIcon,
    MatButton,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatMenuTrigger,
    MatMenu,
    RouterLink,
    NgIf,
    MatMenuItem,
    TranslatePipe,
    LanguageModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  role = '';
  isLoggedIn = false;
  personName = '';

  translate = inject(TranslateService);
  isModalOpen: boolean = false;
  selectedLanguage: string = localStorage.getItem('language') || 'en';
  showForSignup: boolean = true;

  constructor(private router: Router) {
    this.translate.setDefaultLang(this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
  }

  get isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  openLanguageModal() {
    this.isModalOpen = true;
  }

  changeLanguage(language: string) {
    this.selectedLanguage = language;
    this.translate.use(language);
    localStorage.setItem('language', language);
    this.isModalOpen = false;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getStarted() {
    this.showForSignup = false;
    this.router.navigate(['/auth/signup']);
  }

  login() {
    this.showForSignup = false;
    this.router.navigate(['/auth/signin']);
  }
}
