import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {generalMessages, messages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DropDownService} from '../../../services/drop-down.service';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {ServicesService} from '../../services/services.service';
import {ProductService} from '../product.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-edit-products-info',
  templateUrl: './edit-products-info.component.html',
  styleUrls: ['./edit-products-info.component.css']
})
export class EditProductsInfoComponent implements OnInit {
  editProductInfoForm: FormGroup;
  errorMessages = messages;

  constructor(public dialogRef: MatDialogRef<EditProductsInfoComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private productService: ProductService,) {
  }

  ngOnInit(): void {
    this.initUpdateProduct();
  }

  initUpdateProduct() {
    this.editProductInfoForm = this.formBuilder.group({
      title: [this.data.editData.title,
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(3)
        ]
      ],
      link: [this.data.editData.link,
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

  updateProductInfo(value) {
    this.productService.update(value).subscribe(
      (result) => {
        this.closeDialog({
          id: value.id,
          title: result.title,
          link: result.link,
          language: result.language
        });
        this.notificationService.success(generalMessages.successUpdated);
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
  }

  get f() {
    return this.editProductInfoForm.controls;
  }

  isValid() {
    return this.editProductInfoForm.valid;
  }
}
