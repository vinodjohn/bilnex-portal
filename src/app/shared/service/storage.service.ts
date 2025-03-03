import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  role = '';
  private PERSON_KEY = 'auth-person';

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

  public isLoggedIn(): boolean {
    const person = window.sessionStorage.getItem(this.PERSON_KEY);
    return !!person;
  }

  public isAdmin(): boolean {
    const person = this.getPerson();
    return person.role === 'ADMIN';
  }
}

