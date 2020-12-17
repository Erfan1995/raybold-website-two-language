import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../environments/environment';
import {environment as productionEnvironment} from '../../environments/environment.prod';
import {HttpService} from '../services/http.service';
import {Observable} from 'rxjs';
import {GetLangService} from '../services/get-lang.service';

@Injectable({
  providedIn: 'root'
})


export class ServicesService {
  baseUrl = 'api/website-service/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService, private langService: GetLangService) {
    this.baseUrl += this.langService.getLang() + '/';
  }

  listServices(categoryId): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-service-base-category/' + categoryId);
  }

  listAllServices(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'all-services');
  }

  filePath(fileName: string) {
    return this.env.baseUrl.backend.main + 'api/website-service/' + 'serviceContentFile/' + fileName;
  }

  getServiceDetails(serviceId: number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-service-content' + '/' + serviceId);
  }

}
