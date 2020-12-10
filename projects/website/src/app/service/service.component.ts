import {Component, OnInit} from '@angular/core';
import {ServicesService} from './services.service';
import {NotificationService} from '../services/notification.service';
import {generalMessages} from '../validation/commonErrorMessages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  services;

  constructor(private servicesService: ServicesService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.listServices();
  }

  listServices() {
    this.servicesService.listAllServices().subscribe(
      (result) => {
        this.services = result;
        this.services.forEach((item) => {
          item.path = this.servicesService.filePath(item.path);
        });
      }, (error) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
  }

  gotoServiceDetails(id, title, services) {
    this.router.navigate(['/services/services-details'], {
      state: {data: {id, title, services}}
    });
  }
}
