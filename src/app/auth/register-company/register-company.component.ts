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
import {Router, RouterLink} from '@angular/router';
import {Company} from '../../shared/model/Company';
import {SignUp} from '../../shared/model/SignUp';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageService} from '../../shared/service/storage.service';

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
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './register-company.component.html',
  styleUrl: './register-company.component.css',
  encapsulation: ViewEncapsulation.None
})
export class RegisterCompanyComponent implements OnInit {
  workspaceForm!: FormGroup;
  companySuggestions: any[] = [];
  isLoading = false;
  email: string = "";
  isGoogleUser: boolean = false;
  signup: SignUp = new SignUp("", "", "", false, null);

  countries = [
    {
      value: 'EE',
      name: 'ESTONIA',
      flag: 'assets/images/estonia-flag.svg'
    }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private snackBar: MatSnackBar,
              private storageService: StorageService) {
  }

  ngOnInit() {
    this.signup = this.storageService.getSignUp();
    this.email = this.signup.email;

    console.log(this.signup);

    this.workspaceForm = this.fb.group({
      companyCountry: ['EE', Validators.required],
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

  createCompany(): Company {
    const formValues = this.workspaceForm.value;

    return new Company(
      null,
      formValues.companyName,
      formValues.regCode,
      formValues.vatNumber || '',
      formValues.address,
      formValues.city,
      formValues.zip,
      formValues.companyCountry,
      formValues.emailConsent === 'yes',
      false
    );
  }

  onSubmit() {
    if (this.workspaceForm.valid) {
      this.signup = new SignUp(this.signup.email, this.signup.code, this.signup.password, this.signup.isVerified, this.createCompany());
      this.storageService.saveSignUp(this.signup);

      this.router.navigate(['/auth/setup-password'], {state: {signup: this.signup}});
    } else {
      this.snackBar.open('Please fix the errors in the form', 'Close', {
        duration: 2000,
        panelClass: ['snackbar-error']
      });

      this.workspaceForm.markAllAsTouched();
      return;
    }
  }
}
