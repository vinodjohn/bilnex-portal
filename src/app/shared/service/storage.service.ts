import {Injectable} from '@angular/core';
import {SignUp} from '../model/SignUp';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  role = '';
  private PERSON_KEY = 'auth-person';
  private SIGNUP_KEY = 'signup-person';

  constructor() {
  }

  clean(): void {
    window.sessionStorage.clear();
  }

  public savePerson(person: any): void {
    window.sessionStorage.removeItem(this.PERSON_KEY);
    window.sessionStorage.setItem(this.PERSON_KEY, JSON.stringify(person));
  }

  public getPerson(): any {
    const person = window.sessionStorage.getItem(this.PERSON_KEY);

    if (person) {
      return JSON.parse(person);
    }

    return {};
  }

  public saveSignUp(signUp: SignUp): void {
    window.sessionStorage.removeItem(this.SIGNUP_KEY);
    window.sessionStorage.setItem(this.SIGNUP_KEY, JSON.stringify(signUp));
  }

  public getSignUp(): any {
    const signUp = window.sessionStorage.getItem(this.SIGNUP_KEY);

    if (signUp) {
      return JSON.parse(signUp);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const person = window.sessionStorage.getItem(this.PERSON_KEY);
    return !!person;
  }

  public isAdmin(): boolean {
    const person = this.getPerson();
    return person.role === 'ADMIN';
  }
}

