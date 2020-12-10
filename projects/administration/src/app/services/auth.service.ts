import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpServices: HttpService, private router: Router) {
  }


  login(credentials): Observable<any> {
    return this.httpServices._post('api/authentication/login', credentials, {
      observe: 'response'
    }).pipe(
      map((loginData) => {
        const result = loginData.body;
        if (result && result.access_token) {
          localStorage.setItem('access_token', result.access_token);
          return true;
        }
        return false;
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['auth', 'login']);
  }

  isLogedIn() {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('access_token');
    if (token) {
      return jwtHelper.isTokenExpired(token);
    } else {
      return true;
    }
  }

  get getCurrentUser() {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('access_token');
    if (token) {
      return jwtHelper.decodeToken(token);
    } else {
      return 0;
    }
  }


  get accessToken() {
    const token = localStorage.getItem('access_token');
    if (token && !this.isLogedIn()) {
      return token;
    }
    this.logout();
  }
}
