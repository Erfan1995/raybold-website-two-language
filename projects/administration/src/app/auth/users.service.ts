import {Injectable} from '@angular/core';
import {HttpService} from '../services/http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = 'api/users/';

  constructor(private httpServices: HttpService) {
  }

  registerUser(formData: any): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'register-user', formData);

  }
}
