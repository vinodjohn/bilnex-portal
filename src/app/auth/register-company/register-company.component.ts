import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {debounceTime, Observable, of, switchMap} from 'rxjs';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect, MatSelectTrigger} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {NgForOf, NgIf} from '@angular/common';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {TranslatePipe} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-company',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatInput,
    NgIf,
    NgForOf,
    MatRadioGroup,
    MatRadioButton,
    MatLabel,
    MatError,
    FormsModule,
    MatSelectTrigger,
    TranslatePipe
  ],
  templateUrl: './register-company.component.html',
  styleUrl: './register-company.component.css',
  encapsulation: ViewEncapsulation.None
})
export class RegisterCompanyComponent implements OnInit {
  workspaceForm!: FormGroup;
  companySuggestions: any[] = [];
  isLoading = false;
  email: string = "example@example.com";
  isGoogleUser: boolean = false;

  countries = [
    {
      value: 'estonia',
      name: 'ESTONIA',
      flag: 'assets/images/estonia-flag.svg'
    }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    this.workspaceForm = this.fb.group({
      companyCountry: ['estonia', Validators.required],
      companyName: ['', Validators.required],
      regCode: ['', [Validators.required]],
      vatNumber: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zip: [''],
      emailConsent: ['', Validators.required],
    });

    this.workspaceForm.get('companyName')?.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((name) => this.fetchCompanyDetails(name))
      )
      .subscribe((results) => {
        this.companySuggestions = results || [];
      });
  }

  getSelectedFlag(): string {
    const selected = this.countries.find(
      (c) => c.value === this.workspaceForm.get('companyCountry')?.value
    );

    return selected ? selected.flag : '';
  }

  getSelectedCountryName(): string {
    const selected = this.countries.find(
      (c) => c.value === this.workspaceForm.get('companyCountry')?.value
    );

    return selected ? selected.name : '';
  }

  fetchCompanyDetails(name: string): Observable<any[]> {
    if (!name.trim()) return of([]);
    this.isLoading = true;
    return this.http.get<any[]>(`https://localhost:8080/search?query=${name}`).pipe(
      debounceTime(300),
      switchMap((data) => {
        this.isLoading = false;
        return of(data);
      })
    );
  }

  selectCompany(company: any) {
    this.workspaceForm.patchValue({
      companyName: company.name,
      regCode: company.regCode,
      vatNumber: company.vatNumber,
      address: company.address,
      city: company.city,
      zip: company.zip,
    });

    this.companySuggestions = [];
  }

  onCompanyNameInput(event: any) {
    const input = event.target.value;
    if (input.length < 2) {
      this.companySuggestions = [];
      return;
    }
    this.fetchCompanyDetails(input).subscribe((results) => {
      this.companySuggestions = results || [];
    });
  }

  onSubmit() {
    this.router.navigate(['/auth/setup-password']);
    // if (this.workspaceForm.invalid) {
    //   this.workspaceForm.markAllAsTouched();
    //   return;
    // }
  }
}
