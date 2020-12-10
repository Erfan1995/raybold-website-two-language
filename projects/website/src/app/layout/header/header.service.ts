import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from '../../services/http.service';
import {environment as localEnvironment} from '../../../environments/environment';
import {environment as productionEnvironment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

export class HeaderService {
  baseUrl = 'api/header/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService) {
  }

  listServices(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-services');
  }

  listProjectService(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-projects-service');
  }

  filePath(fileName: string) {
    return this.env.baseUrl.backend.main + 'products/' + 'productFiles/' + fileName;
  }

  serviceFilePath(fileName: string) {
    return this.env.baseUrl.backend.main + 'api/service/' + 'serviceContentFile/' + fileName;
  }
}
