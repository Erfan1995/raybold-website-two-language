import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../environments/environment';
import {environment as productionEnvironment} from '../../environments/environment.prod';
import {HttpService} from '../services/http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AboutUsService {
  baseUrl = 'api/about-us/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService) {
  }

  getAboutUsInfo(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'info');
  }

  FilePath(fileName: string) {
    return this.env.baseUrl.backend.main + 'api/aboutus/' + 'aboutUsFiles/' + fileName;
  }
  listCustomersReview(): Observable<any> {
    return this.httpServices.get('api/home/' + 'list-customers-review');
  }

  customerFilePath(fileName: string) {
    return this.env.baseUrl.backend.main + 'api/customers/' + 'customerFiles/' + fileName;
  }
}
