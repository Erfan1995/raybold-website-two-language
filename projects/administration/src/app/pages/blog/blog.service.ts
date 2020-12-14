import {Injectable} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Observable} from 'rxjs';
import {BlogInfoType} from './blog.type';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  baseUrl = 'api/blog/';

  constructor(private httpServices: HttpService) {
  }

  addBlogInfo(formData): Observable<BlogInfoType> {
    return this.httpServices._post(this.baseUrl + 'add-blog-info', formData);
  }

  listBlogInfo(blogListItemRange: number, userId: number): Observable<BlogInfoType> {
    return this.httpServices.get(this.baseUrl + 'list-blog-info' + '/' + blogListItemRange + '/' + userId);
  }

  editBlogInfo(formData): Observable<BlogInfoType> {
    return this.httpServices._post(this.baseUrl + 'update-blog-info', formData);
  }

  deleteBlogInfo(value): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'delete-blog-info', value);
  }

  addBlogContent(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'add-blog-content', formData);
  }

  updateBlogContent(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'update-blog-content', formData);
  }

  filePath(fileName: string) {
    return this.baseUrl + 'blogContentFile/' + fileName;
  }

  listBlogContent(blogId: number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-blog-content' + '/' + blogId);
  }

  deleteBlogContent(value): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'delete-blog-content', value);
  }

  listAllBlog(offset): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'list-all-blog/' + offset);
  }

  updateBlogStatus(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'update-blog-status', formData);
  }

  lisTags(blogId, lan): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'get-blog-tag' + '/' + blogId + '/' + lan);
  }

  addBlogTag(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'add-blog-tag', formData);
  }

  updateBlogTag(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'update-blog-tag', formData);
  }

  deleteBlogTag(formData): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'delete-blog-tag', formData);
  }
}
