import {Injectable} from '@angular/core';
import {CommonDataManagerService} from './common-data-manager.service';
import {LoaderService} from './loader.service';
import {HttpService} from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DropDownService {

  constructor(private http: HttpService, private loader: LoaderService, private commonDataMangerService: CommonDataManagerService) {
  }

  performTheProcess() {
    this.commonDataMangerService.getCommonDataCollection().subscribe((data) => {
      localStorage.setItem('roles', JSON.stringify(data.roles));
      localStorage.setItem('blogCategory', JSON.stringify(data.blogCategory));
      localStorage.setItem('userStatus', JSON.stringify(data.userStatus));
      localStorage.setItem('serviceCategory', JSON.stringify(data.serviceCategory));
      localStorage.setItem('users', JSON.stringify(data.users));
      localStorage.setItem('blogStatus', JSON.stringify(data.blogStatus));

    }, (err) => {
      console.log(err);
    });
  }
  getAll(tableName: string) {
    return JSON.parse(localStorage.getItem(tableName));
  }

  get(tableName: string, id: number) {
    const items = JSON.parse(localStorage.getItem(tableName));
    const item = items.filter((current) => {
      return current.id === parseInt(id.toString());
    });
    return item[0];
  }
}
