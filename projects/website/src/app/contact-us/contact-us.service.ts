import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../environments/environment';
import {environment as productionEnvironment} from '../../environments/environment.prod';
import {HttpService} from '../services/http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ContactUsService {
  baseUrl = 'api/contact-us/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService) {
  }

  sendMessage(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'store-message', formData);
  }
}
