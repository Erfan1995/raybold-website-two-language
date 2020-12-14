import {Component, OnInit} from '@angular/core';
import {HeaderService} from './header.service';
import {Router} from '@angular/router';
import {DynamicScriptLoaderService} from '../../services/DynamicScriptLoaderService';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {GetLangService} from '../../services/get-lang.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  services;
  projectByService;
  serviceCategory = [];
  serviceSubCategory = [];
  index = 0;
  isEqual = true;

  constructor(private headerService: HeaderService,
              private router: Router,
              private dynamicScriptLoader: DynamicScriptLoaderService,
              public translate: TranslateService, private getLang: GetLangService) {
    getLang.configLang();
  }

  ngOnInit(): void {
    this.listService();
    this.listProjectServices();
  }

  listService() {
    this.headerService.listServices().subscribe(
      (result) => {
        this.dynamicScriptLoader.loadScript('main');
        this.services = result;
      }
    );
  }

  listProjectServices() {
    this.headerService.listProjectService().subscribe(
      result => {
        this.projectByService = result;
        for (const service of this.projectByService) {
          this.serviceSubCategory.push(service);
          if (this.serviceSubCategory.length === 5) {
            this.serviceCategory.push(this.serviceSubCategory);
            this.index += 5;
            this.serviceSubCategory = [];
          } else if (this.serviceSubCategory.length === this.projectByService.length - this.index) {
            this.serviceCategory.push(this.serviceSubCategory);
            this.serviceSubCategory = [];
            this.index = 0;
          }
        }
        this.dynamicScriptLoader.loadScript('main');
      }
    );
  }

  changeLang(value) {
    this.translate.use(value);
  }
}
