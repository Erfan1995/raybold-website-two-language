import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../environments/environment';
import {environment as productionEnvironment} from '../../environments/environment.prod';
import {HttpService} from '../services/http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BlogService {
  baseUrl = 'api/blog/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService) {
  }

  listBlog(offSet): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-blog' + '/' + offSet);
  }

  blogFilePath(fileName: string) {
    return this.env.baseUrl.backend.main + this.baseUrl + 'blogContentFile/' + fileName;
  }

  listSearchedBlog(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'list-searched-blog', formData);
  }

  getBlogDetails(blogId: number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-blog-content-tags' + '/' + blogId);
  }

  listRelatedBlog(categoryId): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-related-blog' + '/' + categoryId);
  }

  storeBlogComments(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'store-blog-comment', formData);
  }

  listBlogComment(blogId): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-blog-comment/' + blogId);
  }
}
