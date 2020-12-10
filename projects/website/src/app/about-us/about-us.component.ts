import {Component, OnInit} from '@angular/core';
import {AboutUsService} from './about-us.service';
import {DynamicScriptLoaderService} from '../services/DynamicScriptLoaderService';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  aboutUsInfo;
  customerReview;

  constructor(private aboutUsService: AboutUsService,
              private dynamicScriptLoader: DynamicScriptLoaderService,
  ) {
  }

  ngOnInit(): void {
    this.getAboutUsInfo();
    this.getCustomerReview();
  }

  getAboutUsInfo() {
    this.aboutUsService.getAboutUsInfo().subscribe(
      (result) => {
        this.aboutUsInfo = result;
        this.aboutUsInfo.forEach((item) => {
          item.path = this.aboutUsService.FilePath(item.path);
        });
      }
    );
  }

  getCustomerReview() {
    this.aboutUsService.listCustomersReview().subscribe(
      (result) => {
        this.customerReview = result;
        this.customerReview.forEach((item) => {
          item.path = this.aboutUsService.customerFilePath(item.path);
        });
        this.dynamicScriptLoader.loadScript('main');
      }
    );
  }
}
