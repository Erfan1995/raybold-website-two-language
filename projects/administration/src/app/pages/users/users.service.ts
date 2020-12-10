import {Injectable} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Observable} from 'rxjs';
import {UsersType} from './users.type';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = 'api/users/';

  constructor(private httpServices: HttpService) {
  }

  list(): Observable<UsersType> {
    return this.httpServices.get(this.baseUrl + 'list-users');
  }

  update(formData: UsersType): Observable<UsersType> {
    return this.httpServices._post(this.baseUrl + 'update-users', formData);
  }
  delete(data: any): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'delete-users', data);
  }
}
