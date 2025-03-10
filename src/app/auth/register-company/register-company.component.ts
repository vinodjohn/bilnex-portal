import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect, MatSelectTrigger} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {NgForOf, NgIf} from '@angular/common';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {TranslatePipe} from '@ngx-translate/core';
import {Router, RouterLink} from '@angular/router';
import {CompanyDto} from '../../shared/model/CompanyDto';
import {SignUp} from '../../shared/model/SignUp';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageService} from '../../shared/service/storage.service';
import {AuthService} from '../../shared/service/auth.service';
import {SignIn} from '../../shared/model/SignIn';

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
  loading = false;
  errorMessage = '';

  countries = [
    {
      value: 'EE',
      name: 'ESTONIA',
      flag: 'assets/images/estonia-flag.svg'
    }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private snackBar: MatSnackBar,
              private storageService: StorageService, private authService: AuthService) {
  }

  ngOnInit() {
    this.signup = this.storageService.getSignUp();
    this.email = this.signup.email;
    this.isGoogleUser = this.signup.code === "0";

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

    // TODO: Get company from API
    // this.workspaceForm.get('companyName')?.valueChanges
    //   .pipe(
    //     debounceTime(500),
    //     switchMap((name) => this.fetchCompanyDetails(name))
    //   )
    //   .subscribe((results) => {
    //     this.companySuggestions = results || [];
    //   });
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

  // TODO: Get company from API
  // fetchCompanyDetails(name: string): Observable<any[]> {
  //   if (!name.trim()) return of([]);
  //   this.isLoading = true;
  //   return this.http.get<any[]>(`https://localhost:8080/search?query=${name}`).pipe(
  //     debounceTime(300),
  //     switchMap((data) => {
  //       this.isLoading = false;
  //       return of(data);
  //     })
  //   );
  // }

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

  // TODO: Get company from API
  // onCompanyNameInput(event: any) {
  //   const input = event.target.value;
  //   if (input.length < 2) {
  //     this.companySuggestions = [];
  //     return;
  //   }
  //   this.fetchCompanyDetails(input).subscribe((results) => {
  //     this.companySuggestions = results || [];
  //   });
  // }

  createCompany(): CompanyDto {
    const formValues = this.workspaceForm.value;

    return new CompanyDto(
      null,
      formValues.companyName,
      formValues.regCode,
      formValues.vatNumber || '',
      formValues.address,
      formValues.city,
      formValues.zip,
      formValues.companyCountry,
      formValues.emailConsent === 'yes',
      true,
      false
    );
  }

  onSubmit() {
    if (this.workspaceForm.valid) {
      this.signup = new SignUp(this.signup.email, this.signup.code, this.signup.password, this.signup.isVerified, this.createCompany());
      this.storageService.saveSignUp(this.signup);

      if (this.isGoogleUser) {
        this.authService.signUpConfirm(this.signup).subscribe({
          next: () => {
            this.loading = false;

            this.snackBar.open("Congratulations! Workspace created successfully.", 'Close', {
              duration: 5000,
              panelClass: ['snackbar-']
            });

            this.authService.signIn(new SignIn(this.signup.email, "!")).subscribe({
              next: data => {
                this.storageService.savePerson(data);
                this.loading = false;
                this.router.navigate(['/dashboard']);
              },
              error: err => {
                this.errorMessage = err.error.message;
                this.loading = false;

                this.snackBar.open(this.errorMessage.concat(" ").concat(err.error.details.map((x: any) => x).join(",")), 'Close', {
                  duration: 2000,
                  panelClass: ['snackbar-error']
                });
              }
            });
          },
          error: err => {
            this.errorMessage = err.error.message;
            this.loading = false;

            this.snackBar.open(this.errorMessage, 'Close', {
              duration: 2000,
              panelClass: ['snackbar-error']
            });
          }
        });
      } else {
        this.router.navigate(['/auth/setup-password'], {state: {signup: this.signup}});
      }
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
