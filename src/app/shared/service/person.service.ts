import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GenResponseList} from '../model/GenResponseList';
import {environment} from '../../../environments/environment';
import {ChangePassword} from '../model/ChangePassword';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private PERSON_URL = 'person';

  constructor(private httpClient: HttpClient) {
  }

  public getPersonById(id: string) {
    return this.httpClient.get(this.PERSON_URL.concat('/').concat(id));
  }

  public getAllPersons(sort: string, order: string, page: number) {
    return this.httpClient.get<GenResponseList>(this.PERSON_URL + '?page=' + page + '&items='
      + environment.itemsPerPage + '&sort=' + sort + '&order=' + order);
  }

  public deletePerson(id: string) {
    return this.httpClient.get(this.PERSON_URL.concat('/delete/').concat(id));
  }

  public restorePerson(id: string) {
    return this.httpClient.get(this.PERSON_URL.concat('/restore/').concat(id));
  }

  public changePassword(changePassword: ChangePassword) {
    return this.httpClient.post(this.PERSON_URL.concat('/change-password'), changePassword);
  }

  public updateSystemLanguage(id: string, language: string) {
    return this.httpClient.get(this.PERSON_URL.concat('/' + id).concat('/update-system-language/').concat(language));
  }
}
