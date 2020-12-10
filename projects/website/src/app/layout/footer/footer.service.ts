import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../../environments/environment';
import {environment as productionEnvironment} from '../../../environments/environment.prod';
import {HttpService} from '../../services/http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FooterService {
  baseUrl = 'api/header/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService) {
  }

  listServices(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-services');
  }
}
