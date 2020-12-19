import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DropDownService} from '../../../services/drop-down.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {ServicesService} from '../services.service';
import {generalMessages, messages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-edit-service-info-dialog',
  templateUrl: './edit-service-info-dialog.component.html',
  styleUrls: ['./edit-service-info-dialog.component.css']
})
export class EditServiceInfoDialogComponent implements OnInit {
  editServiceInfoForm: FormGroup;
  errorMessages = messages;
  serviceCategory;

  constructor(public dialogRef: MatDialogRef<EditServiceInfoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private dropDownServices: DropDownService,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private servicesService: ServicesService,
  ) {
  }

  ngOnInit(): void {
    this.serviceCategory = this.dropDownServices.getAll('serviceCategory');
    this.initUpdateServiceCategory();
  }

  initUpdateServiceCategory() {
    this.editServiceInfoForm = this.formBuilder.group({
      title: [this.data.editData.title,
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(3)
        ]
      ],
      service_category_id: [this.data.editData.service_category_id,
        [
          Validators.required,
        ]
      ],
      language: [this.data.editData.language,
        [
          Validators.required,
        ]
      ],
      id: this.data.editData.id

    });
  }

  closeDialog(value = null) {
    if (value) {
      this.dialogRef.close(value);
    } else {
      this.dialogRef.close(null);
    }
  }

  updateServiceInfo(value) {
    this.servicesService.editServiceInfo(value).subscribe(
      (result) => {
        this.closeDialog({
          id: value.id,
          title: result.title,
          language: result.language,
          service_category_id: result.service_category_id
        });
        this.notificationService.success(generalMessages.successUpdated);
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
  }

  get f() {
    return this.editServiceInfoForm.controls;
  }

  isValid() {
    return this.editServiceInfoForm.valid;
  }
}
