import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ServicesService} from '../services.service';
import {DynamicScriptLoaderService} from '../../services/DynamicScriptLoaderService';

@Component({
  selector: 'app-services-details',
  templateUrl: './services-details.component.html',
  styleUrls: ['./services-details.component.css']
})
export class ServicesDetailsComponent implements OnInit {
  serviceId;
  serviceName;
  serviceDetails;
  serviceList;
  serviceCategoryId;
  serviceMethodCalled = false;

  constructor(private activatedRoute: ActivatedRoute,
              private servicesService: ServicesService) {
    this.activatedRoute.params.subscribe(routeParams => {
      this.serviceId = Number(this.activatedRoute.snapshot.params.id);
      this.serviceName = this.activatedRoute.snapshot.params.title;
      this.serviceCategoryId = this.activatedRoute.snapshot.params.serviceCategoryId;
      this.getServiceDetails();
      this.getServiceList();
      this.serviceMethodCalled = true;
    });
  }

  ngOnInit(): void {
    this.serviceId = Number(this.activatedRoute.snapshot.params.id);
    this.serviceName = this.activatedRoute.snapshot.params.title;
    if (this.serviceMethodCalled === false) {
      this.getServiceList();
      this.getServiceDetails();
    }
  }

  getServiceDetails(serviceId = null, serviceName = null) {
    if (serviceId) {
      this.serviceId = serviceId;
      this.serviceName = serviceName;
    }
    this.servicesService.getServiceDetails(this.serviceId).subscribe(
      (result) => {
        this.serviceDetails = result;
        this.serviceDetails.reverse();
        this.serviceDetails.forEach((item) => {
          if (item.file_path !== null) {
            item.file_path = this.servicesService.filePath(item.file_path);
          }
        });
      }
    );
  }

  getServiceList() {
    this.servicesService.listServices(this.serviceCategoryId).subscribe(
      (result) => {
        this.serviceList = result;
        this.serviceList.forEach((item) => {
          if (item.path !== null) {
            item.path = this.servicesService.filePath(item.path);
          }
        });
      }
    );
  }

}
