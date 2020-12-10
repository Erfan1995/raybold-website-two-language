import {Injectable} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {HttpService} from '../../services/http.service';
import {Observable} from 'rxjs';
import {environment as localEnvironment} from '../../../environments/environment';
import {environment as productionEnvironment} from '../../../environments/environment.prod';
import {IProduct, IProductFile} from './products.type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'api/products/';
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

  store(formData: IProduct): Observable<IProduct> {
    return this.httpServices._post(this.baseUrl + 'store-products', formData);
  }

  storeFile(formData: any): Observable<IProductFile> {
    return this.httpServices._post(this.baseUrl + 'store-product-file', formData);
  }

  update(formData: IProduct): Observable<IProduct> {
    return this.httpServices._post(this.baseUrl + 'update-products', formData);
  }

  delete(id: number): Observable<number> {
    return this.httpServices.get(this.baseUrl + 'delete-products/' + id);
  }

  deleteFile(id: number): Observable<number> {
    return this.httpServices.get(this.baseUrl + 'delete-product-file/' + id);
  }

  listProducts(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-products');
  }

  listProductFiles(productId: number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-product-files/' + productId);
  }

  filePath(fileName: string) {
    return this.env.baseUrl.backend.main + '' + this.baseUrl + 'productFiles/' + fileName;
  }

  listProductContent(productId): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-product-content/' + productId);
  }

  deleteProductContent(value): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'delete-product-content', value);
  }

  addProductContent(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'add-product-content', formData);
  }

  updateProductContent(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'update-product-content', formData);
  }
  listAllProducts(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-all-product');
  }
}
