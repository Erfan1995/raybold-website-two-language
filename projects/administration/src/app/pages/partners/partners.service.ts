import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from '../../services/http.service';
import {AuthService} from '../../services/auth.service';
import {environment as localEnvironment} from '../../../environments/environment';
import {environment as productionEnvironment} from '../../../environments/environment.prod';
import {IPartner} from './partners.component';

@Injectable({
  providedIn: 'root'
})
export class PartnersService {
  private baseUrl = 'api/partners/';
  private requestHeader;
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService, private authService: AuthService) {
    // this.requestHeader = {
    //   headers: new HttpHeaders()
    //     .set('authorization', this.authService.accessToken),
    //   observe: 'response'
    // };
    // const header = new HttpHeaders();
    // header.append('Content-Type', 'multipart/form-data');
    // header.append('Accept', 'application/json');

  }

  store(formData: any): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'store-partners', formData);
  }


  update(formData: any): Observable<IPartner> {
    return this.httpServices._post(this.baseUrl + 'update-partners', formData);
  }

  delete(id: number): Observable<number> {
    return this.httpServices.get(this.baseUrl + 'delete-partners/' + id);
  }

  listPartners(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-partners');
  }

  filePath(fileName: string) {
    return this.env.baseUrl.backend.main + '' + this.baseUrl + 'partnerFiles/' + fileName;
  }

}
