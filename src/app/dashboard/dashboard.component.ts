import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {StorageService} from '../shared/service/storage.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userName: string = 'User';

  constructor(private storageService: StorageService) {
  }

  ngOnInit() {
    const user = this.storageService.getPerson();

    if (user && user.email) {
      this.userName = this.extractNameFromEmail(user.email);
    }
  }

  extractNameFromEmail(email: string): string {
    if (!email.includes('@')) return 'User';
    let name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
