import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminBloggerAuthGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }


  canActivate() {
    const user = this.authService.getCurrentUser;
    if (user && user.role_slug === 'admin' || user.role_slug === 'blogger') {
      return true;
    }

    this.router.navigate(['no-access']);
    return false;
  }
}
