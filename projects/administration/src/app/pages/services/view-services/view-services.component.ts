import {Component, OnInit} from '@angular/core';
import {environment as localEnvironment} from '../../../../environments/environment';
import {environment as productionEnvironment} from '../../../../environments/environment.prod';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {DropDownService} from '../../../services/drop-down.service';
import {ServicesService} from '../services.service';
import {HttpErrorResponse} from '@angular/common/http';
import {generalMessages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {ShowServiceDetailsComponent} from '../show-service-details/show-service-details.component';
import {DialogService} from '../../../services/dialog.service';

@Component({
  selector: 'app-view-services',
  templateUrl: './view-services.component.html',
  styleUrls: ['./view-services.component.css']
})
export class ViewServicesComponent implements OnInit {
  serviceList;
  env = localEnvironment || productionEnvironment;

  constructor(private dialog: MatDialog,
              private notificationService: NotificationService,
              private loader: LoaderService,
              public dropdownServices: DropDownService,
              private servicesService: ServicesService,
              private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.listAllServices();
  }

  listAllServices() {
    this.servicesService.listAllServices().subscribe(
      (result) => {
        this.serviceList = result;
        for (const service of this.serviceList) {
          for (const serviceDetails of service.service_details) {
            if (serviceDetails.file_path !== null) {
              serviceDetails.file_path = this.env.baseUrl.backend.main + this.servicesService.filePath(serviceDetails.file_path);
            }
          }
        }
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
  }

  openServiceDetailsDialog(service) {
    const dialogRef = this.dialog.open(ShowServiceDetailsComponent, {
      height: '700px',
      width: '800px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'backdropBackground',
      data: {serviceData: service}
    });
  }

  deleteService(service) {
    service.id = service.service_id;
    this.dialogService.openConfirmDialog(generalMessages.confirmMessage)
      .afterClosed().subscribe(
      res => {
        if (res) {
          this.servicesService.deleteServiceInfo(service).subscribe(
            response => {
              this.notificationService.success(generalMessages.successDeleted);
              this.serviceList = this.serviceList.filter((item) => item.id !== response.id);
            }, (error: HttpErrorResponse) => {
              this.notificationService.warn(generalMessages.serverProblem);
            });
        }
      }
    );
  }
}
