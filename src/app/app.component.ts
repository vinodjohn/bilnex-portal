import {Component, ElementRef, inject, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {NgIf} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LanguageModalComponent} from './language-modal/language-modal.component';
import {Subscription} from 'rxjs';
import {EventBusService} from './shared/service/event-bus.service';
import {StorageService} from './shared/service/storage.service';
import {AuthService} from './shared/service/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

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
export class AppComponent implements OnInit, OnDestroy {
  role = '';
  isLoggedIn = false;
  personName = '';
  translate = inject(TranslateService);
  isModalOpen: boolean = false;
  selectedLanguage: string = localStorage.getItem('language') || 'en';
  showForSignup: boolean = true;

  eBSubs?: Subscription;
  routerSubscription: Subscription | null = null;

  constructor(private router: Router, private eventBusService: EventBusService, private storageService: StorageService,
              private authService: AuthService, private snackBar: MatSnackBar, private el: ElementRef, private renderer: Renderer2) {
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

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.onComponentLoad();
    this.showForSignup = !this.isLoggedIn;

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Route changed to:', event.url);
        this.onRouteChange(event.url);
        this.onComponentLoad();
      }
    });

    this.eBSubs = this.eventBusService.on('sign-out', () => {
      this.signOut();
    });
  }

  onComponentLoad() {
    this.isLoggedIn = this.storageService.isLoggedIn();
    console.log(this.router.url);
    console.log(this.router.url.indexOf('/auth/signup'));

    if (this.isLoggedIn) {
      const person = this.storageService.getPerson();
      this.role = person.role;
      this.personName = this.extractNameFromEmail(person.email);
    } else if (this.router.url.indexOf('/auth') < 0) {
      this.router.navigate(['']);
    }
  }

  signOut(): void {
    this.authService.signOut().subscribe({
      next: () => {
        this.storageService.clean();

        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      },
      error: () => {
        this.snackBar.open('Technical error. Sign out failed!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  private onRouteChange(newRoute: string) {
    if (newRoute !== '/') {
      this.renderer.setStyle(this.el.nativeElement.querySelector('.logo'), 'transform', 'scale(0.75)');
    }
  }

  extractNameFromEmail(email: string): string {
    if (!email.includes('@')) return 'User';
    let name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
