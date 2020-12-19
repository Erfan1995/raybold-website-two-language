import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../environments/environment';
import {environment as productionEnvironment} from '../../environments/environment.prod';
import {HttpService} from '../services/http.service';
import {Observable} from 'rxjs';
import {GetLangService} from '../services/get-lang.service';

@Injectable({
  providedIn: 'root'
})

export class AboutUsService {
  baseUrl = 'api/about-us/';
  lang;
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService, private langService: GetLangService) {
    this.baseUrl += this.langService.getLang() + '/';
    this.lang = this.langService.getLang() + '/';

  }

  getAboutUsInfo(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'info');
  }

  FilePath(fileName: string) {
    return this.env.baseUrl.backend.main + 'api/aboutus/' + 'aboutUsFiles/' + fileName;
  }

  listCustomersReview(): Observable<any> {
    return this.httpServices.get('api/home/' + this.lang + '/list-customers-review');
  }

  customerFilePath(fileName: string) {
    return this.env.baseUrl.backend.main + 'api/customers/' + 'customerFiles/' + fileName;
  }
}
