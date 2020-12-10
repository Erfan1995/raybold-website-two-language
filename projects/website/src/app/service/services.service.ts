import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../environments/environment';
import {environment as productionEnvironment} from '../../environments/environment.prod';
import {HttpService} from '../services/http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ServicesService {
  baseUrl = 'api/website-service/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService) {
  }

  listServices(categoryId): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-service-base-category/' + categoryId);
  }

  listAllServices(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'all-services');
  }

  filePath(fileName: string) {
    return this.env.baseUrl.backend.main + this.baseUrl + 'serviceContentFile/' + fileName;
  }

  getServiceDetails(serviceId: number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-service-content' + '/' + serviceId);
  }

}
