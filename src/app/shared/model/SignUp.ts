import {CompanyDto} from './CompanyDto';

export class SignUp {
  email: string;
  code: string;
  password: string;
  isVerified: boolean;
  company: CompanyDto | null;

  constructor(email: string, code: string, password: string, isVerified: boolean, company: CompanyDto | null) {
    this.email = email;
    this.code = code;
    this.password = password;
    this.isVerified = isVerified;
    this.company = company;
  }
}
