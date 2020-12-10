import {Component, OnInit} from '@angular/core';
import {HomeService} from './home.service';
import {Router} from '@angular/router';
import {generalMessages} from '../validation/commonErrorMessages';
import {NotificationService} from '../services/notification.service';
import {DynamicScriptLoaderService} from '../services/DynamicScriptLoaderService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products;
  customers;
  latestBlog;
  review;

  constructor(private dynamicScriptLoader: DynamicScriptLoaderService,
              private homeService: HomeService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.listCustomers();
    this.listProducts();
    this.listLatestBlog();
  }

  listProducts() {
    this.homeService.listProducts().subscribe(
      result => {
        this.products = result;
        this.products.forEach((item) => {
          item.path = this.homeService.productFilePath(item.path);
        });
        for (let i = 0; i < this.products.length; i++) {
          if (i === 0) {
            this.products[i].color = 'pricing-primary';
          } else if (i === 1) {
            this.products[i].color = 'pricing-red';
          } else if (i === 2) {
            this.products[i].color = 'pricing-orange';
          } else if (i === 3) {
            this.products[i].color = 'pricing-yellow';
          } else if (i === 4) {
            this.products[i].color = 'pricing-blue';
          }
        }
      }, (error) => {
      });
  }


  listCustomers() {
    this.homeService.listCustomersReview().subscribe(
      result => {
        this.customers = result;
        this.customers.forEach((item) => {
          item.path = this.homeService.customerFilePath(item.path);
        });
        this.dynamicScriptLoader.loadScript('main');
      }
    );
  }

  listLatestBlog() {
    // this.loader.openLoader();
    this.homeService.listLatestBlog().subscribe(
      result => {
        this.latestBlog = result;
        this.latestBlog.forEach((item) => {
          item.path = this.homeService.blogFilePath(item.path);
        });
      }
    );
  }


}
