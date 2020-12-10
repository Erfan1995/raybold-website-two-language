import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../environments/environment';
import {environment as productionEnvironment} from '../../environments/environment.prod';
import {HttpService} from '../services/http.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProjectsService {
  baseUrl = 'api/projects/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService) {
  }

  listProjects(serviceId: number, offset: number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-projects-by-service/' + serviceId + '/' + offset);
  }

  FilePath(fileName: string) {
    return this.env.baseUrl.backend.main + this.baseUrl + 'projectFiles/' + fileName;
  }

  listProjectWithOffset(offset: number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-projects-by-offset/' + offset);
  }
}

