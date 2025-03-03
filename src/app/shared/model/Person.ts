import {CompanyDto} from './CompanyDto';

export class Person {
  id: number;
  email: string;
  role: string;
  companies: CompanyDto[];
  isVerified: boolean;
  defaultSystemLanguage: string;
  isActive: boolean;

  constructor(id: number, email: string, password: string, role: string, isVerified: boolean, companies: CompanyDto[], defaultSystemLanguage: string, isActive: boolean) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.isVerified = isVerified;
    this.companies = companies;
    this.defaultSystemLanguage = defaultSystemLanguage;
    this.isActive = isActive;
  }
}
