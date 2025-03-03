import {Company} from './Company';

export class SignUp {
  email: string;
  code: string;
  password: string;
  isVerified: boolean;
  company: Company;

  constructor(email: string, code: string, password: string, isVerified: boolean, company: Company) {
    this.email = email;
    this.code = code;
    this.password = password;
    this.isVerified = isVerified;
    this.company = company;
  }
}
