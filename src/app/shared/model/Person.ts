import {Company} from './Company';

export class Person {
  id: number;
  email: string;
  role: string;
  companies: Company[];
  isVerified: boolean;
  defaultSystemLanguage: string;
  isActive: boolean;

  constructor(id: number, email: string, password: string, role: string, isVerified: boolean, companies: Company[], defaultSystemLanguage: string, isActive: boolean) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.isVerified = isVerified;
    this.companies = companies;
    this.defaultSystemLanguage = defaultSystemLanguage;
    this.isActive = isActive;
  }
}
