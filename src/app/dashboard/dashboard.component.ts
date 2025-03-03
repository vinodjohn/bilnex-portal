import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {StorageService} from '../shared/service/storage.service';
import {TranslatePipe} from '@ngx-translate/core';
import {CompanyDto} from '../shared/model/CompanyDto';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    TranslatePipe
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

    this.userName = user.companyDtoList.find((company: CompanyDto) => company.isDefault)?.name || 'Default Company';
  }

}
