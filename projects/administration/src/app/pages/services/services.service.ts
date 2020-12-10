import {Injectable} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Observable} from 'rxjs';
import {ServicesType} from './services.type';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  baseUrl = 'api/service/';

  constructor(private httpServices: HttpService) {
  }

  addServiceInfo(formDate): Observable<ServicesType> {
    return this.httpServices._post(this.baseUrl + 'add-service-info', formDate);
  }

  listServiceInfo(): Observable<ServicesType> {
    return this.httpServices.get(this.baseUrl + 'list-service-info');
  }

  editServiceInfo(formData): Observable<ServicesType> {
    return this.httpServices._post(this.baseUrl + 'edit-service-info', formData);
  }

  deleteServiceInfo(value): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'delete-service-info', value);
  }

  addServiceContent(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'add-service-content', formData);
  }

  updateServiceContent(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'update-service-content', formData);
  }

  filePath(fileName: string) {
    return this.baseUrl + 'serviceContentFile/' + fileName;
  }

  listServiceContent(serviceId: number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-service-content' + '/' + serviceId);
  }

  deleteServiceContent(value): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'delete-service-content', value);
  }

  listAllServices(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-all-service');
  }
}
