import {Injectable} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {HttpService} from '../../services/http.service';
import {Observable} from 'rxjs';
import {environment as localEnvironment} from '../../../environments/environment';
import {environment as productionEnvironment} from '../../../environments/environment.prod';
import {IAboutUs, IIAboutUsFile} from './about-us.component';

@Injectable({
  providedIn: 'root'
})
export class AboutUsService {
  private baseUrl = 'api/aboutus/';
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

  store(formData: IAboutUs): Observable<IAboutUs> {
    return this.httpServices._post(this.baseUrl + 'store-aboutus', formData);
  }

  storeFile(formData: any): Observable<IIAboutUsFile> {
    return this.httpServices._post(this.baseUrl + 'store-aboutus-file', formData);
  }

  update(formData: IAboutUs): Observable<IAboutUs> {
    return this.httpServices._post(this.baseUrl + 'update-aboutus', formData);
  }

  delete(id: number): Observable<number> {
    return this.httpServices.get(this.baseUrl + 'delete-aboutus/' + id);
  }

  deleteFile(id: number): Observable<number> {
    return this.httpServices.get(this.baseUrl + 'delete-aboutus-file/' + id);
  }

  listAboutUs(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-aboutus');
  }

  listAboutUsFiles(aboutUsId: number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-aboutus-files/' + aboutUsId);
  }

  filePath(fileName: string) {
    return this.env.baseUrl.backend.main + '' + this.baseUrl + 'aboutUsFiles/' + fileName;
  }

}
