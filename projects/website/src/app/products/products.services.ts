import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../environments/environment';
import {environment as productionEnvironment} from '../../environments/environment.prod';
import {HttpService} from '../services/http.service';
import {Observable} from 'rxjs';
import {GetLangService} from '../services/get-lang.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsServices {
  baseUrl = 'api/products/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService, private langService: GetLangService) {
    this.baseUrl += this.langService.getLang() + '/';
  }

  listAllProducts(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-products-info');
  }

  getProductContent(productId: number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-product-content/' + productId);
  }

  listProducts(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-products-website');
  }

  FilePath(fileName: string) {
    return this.env.baseUrl.backend.main + this.baseUrl + 'productFiles/' + fileName;
  }
}
