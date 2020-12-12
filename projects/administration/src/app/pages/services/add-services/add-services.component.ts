import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {generalMessages, messages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {DropDownService} from '../../../services/drop-down.service';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {ServicesService} from '../services.service';
import {ServicesType} from '../services.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {DialogService} from '../../../services/dialog.service';
import {EditServiceInfoDialogComponent} from '../edit-service-info-dialog/edit-service-info-dialog.component';

@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css']
})
export class AddServicesComponent implements OnInit {
  serviceForm: FormGroup;
  errorMessages = messages;
  serviceCategory;
  servicesList;

  constructor(private dropDownServices: DropDownService,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private servicesService: ServicesService,
              private dialog: MatDialog,
              private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.serviceCategory = this.dropDownServices.getAll('serviceCategory');
    this.listServices();
    this.initServiceInfo();
  }

  initServiceInfo() {
    this.serviceForm = this.formBuilder.group({
      service_category_id: ['',
        [
          Validators.required
        ]
      ],
      language: ['',
        [
          Validators.required
        ]
      ],
      title: ['',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(3)
        ]
      ]
    });
  }

  listServices() {
    this.servicesService.listServiceInfo().subscribe(
      (result: ServicesType) => {
        this.servicesList = result;
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
  }

  addServices(value) {
    this.loader.openLoader();
    this.servicesService.addServiceInfo(value).subscribe(
      (result: ServicesType) => {
        this.servicesList.push({
          service_category_id: result.service_category_id,
          title: result.title,
          id: result.id,
          service_category: this.dropDownServices.get('serviceCategory', result.service_category_id).title
        });
        this.notificationService.success(generalMessages.successInserted);
        this.servicesList.reverse();
        this.initServiceInfo();
        this.loader.closeLoader();
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
        this.loader.closeLoader();
      });

  }

  editServiceInfo(service) {
    const dialogRef = this.dialog.open(EditServiceInfoDialogComponent, {
      height: '400px',
      width: '400px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'backdropBackground',
      data: {editData: service}
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.servicesList.find(item => {
            if (result.id === item.id) {
              item.title = result.title;
              item.service_category_id = result.service_category_id;
              item.service_category = this.dropDownServices.get('serviceCategory', result.service_category_id).title;
            }
          });
        }
      }
    );
  }

  deleteService(service) {
    this.dialogService.openConfirmDialog(generalMessages.confirmMessage)
      .afterClosed().subscribe(
      res => {
        if (res) {
          this.servicesService.deleteServiceInfo(service).subscribe(
            response => {
              this.notificationService.success(generalMessages.successDeleted);
              this.servicesList = this.servicesList.filter((item) => item.id !== response.id);
            }, (error: HttpErrorResponse) => {
              this.notificationService.warn(generalMessages.serverProblem);
            });
        }
      }
    );
  }

  reset() {
    this.serviceForm.reset();
  }

  get f() {
    return this.serviceForm.controls;
  }

  isValid() {
    return this.serviceForm.valid;
  }
}
