import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../../environments/environment';
import {environment as productionEnvironment} from '../../../environments/environment.prod';
import {HttpService} from '../../services/http.service';
import {Observable} from 'rxjs';
import {GetLangService} from '../../services/get-lang.service';

@Injectable({
  providedIn: 'root'
})

export class FooterService {
  baseUrl = 'api/header/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService, private langService: GetLangService) {
    this.baseUrl += this.langService.getLang() + '/';

  }

  listServices(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-services');
  }

  subscribe(data): Observable<any> {
    return this.httpServices._post('api/header/' + 'subscribe', data);
  }

}
