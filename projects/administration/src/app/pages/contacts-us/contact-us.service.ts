import {Injectable} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  private serviceUrl = 'api/contact-us/';

  constructor(private httpServices: HttpService) {
  }

  listContactUs(): Observable<any> {
    return this.httpServices.get(this.serviceUrl + 'list-contact-us-info');
  }
}
