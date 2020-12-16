import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../environments/environment';
import {environment as productionEnvironment} from '../../environments/environment.prod';
import {Observable} from 'rxjs';
import {HttpService} from '../services/http.service';
import {GetLangService} from '../services/get-lang.service';

@Injectable({
  providedIn: 'root'
})

export class HomeService {
  baseUrl = 'api/home/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService, private langService: GetLangService) {
    this.baseUrl += this.langService.getLang() + '/';

  }

  listProducts(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-products');
  }


  productFilePath(fileName: string) {
    return this.env.baseUrl.backend.main + 'api/products/' + 'productFiles/' + fileName;
  }

  listCustomersReview(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-customers-review');
  }

  customerFilePath(fileName: string) {
    return this.env.baseUrl.backend.main + 'api/customers/' + 'customerFiles/' + fileName;
  }

  listLatestBlog(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-latest-blog');
  }

  blogFilePath(fileName: string) {
    return this.env.baseUrl.backend.main + 'api/blog/' + 'blogContentFile/' + fileName;
  }


}
