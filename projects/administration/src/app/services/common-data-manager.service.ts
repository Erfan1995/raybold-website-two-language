import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonDataManagerService {
  private baseUrl = 'api/common-data-manager/';
  private requestHeader;

  constructor(private httpServices: HttpService, private authService: AuthService) {
  }

  getCommonDataCollection(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'common-data', this.requestHeader);
  }

  // getServiceCategory(): Observable<any> {
  //   return this.httpServices.get(this.baseUrl + 'service-category', this.requestHeader);
  // }
}
