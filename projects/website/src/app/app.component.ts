import {Component, OnInit} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {FacebookService, InitParams} from 'ngx-facebook';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'website';
  showLoader = true;

  constructor(private router: Router, private fb: FacebookService) {
    router.events.subscribe((routerEvent: RouterEvent) => {
      this.checkRouteChange(routerEvent);
    });

  }

  ngOnInit(): void {
    this.initFacebookService();
  }

  private initFacebookService(): void {
    const initParams: InitParams = {
      xfbml: true,
      version: 'v9.0'
    };
    this.fb.init(initParams);
  }

  checkRouteChange(routerEvent: RouterEvent) {
    if (routerEvent instanceof NavigationStart) {
      this.showLoader = true;
    }
    // if route change ended
    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.showLoader = false;
    }
    // if route change started
  }
}
