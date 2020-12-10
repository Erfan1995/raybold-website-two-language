import {Injectable} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Observable} from 'rxjs';
import {environment as localEnvironment} from '../../../environments/environment';
import {environment as productionEnvironment} from '../../../environments/environment.prod';
import {IProjectFile} from './projects.type';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private baseUrl = 'api/projects/';
  private serviceUrl = 'api/service/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService) {

  }

  store(formData: any): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'store-projects', formData);
  }

  update(formData: any): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'update-projects', formData);
  }

  delete(id: number): Observable<number> {
    return this.httpServices.get(this.baseUrl + 'delete-projects/' + id);
  }

  listProjects(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-projects');
  }

  filePath(fileName: string) {
    return this.env.baseUrl.backend.main + '' + this.baseUrl + 'projectFiles/' + fileName;
  }

  listServices(): Observable<any> {
    return this.httpServices.get(this.serviceUrl + 'list-service-info');
  }

  storeFile(formData): Observable<IProjectFile> {
    return this.httpServices._post(this.baseUrl + 'store-project-file', formData);
  }

  listProjectFiles(projectId: number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-project-files/' + projectId);
  }

  deleteFile(id: number, projectFileId: number): Observable<number> {
    return this.httpServices.get(this.baseUrl + 'delete-project-file/' + id + '/' + projectFileId);
  }
}
