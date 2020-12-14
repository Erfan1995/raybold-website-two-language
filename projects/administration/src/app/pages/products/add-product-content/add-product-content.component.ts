import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DropDownService} from '../../../services/drop-down.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {DialogService} from '../../../services/dialog.service';
import {ProductService} from '../product.service';
import {HttpErrorResponse} from '@angular/common/http';
import {generalMessages, messages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {environment as localEnvironment} from '../../../../environments/environment';
import {environment as productionEnvironment} from '../../../../environments/environment.prod';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-add-product-content',
  templateUrl: './add-product-content.component.html',
  styleUrls: ['./add-product-content.component.css']
})
export class AddProductContentComponent implements OnInit {
  productId;
  productTitle;
  productContent = [];
  fileSrc;
  addProductContentForm: FormGroup;
  public Editor = ClassicEditor;
  myFile;
  env = localEnvironment || productionEnvironment;
  errorMessages = messages;
  fileType = '';
  fileSize;
  updateMode = false;
  addOrUpdateButton = 'اضافه نمودن محتوا';
  language;

  constructor(private activatedRoute: ActivatedRoute,
              private dropDownServices: DropDownService,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private productService: ProductService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params.id;
    this.productTitle = this.activatedRoute.snapshot.params.title;
    this.language = this.activatedRoute.snapshot.params.language;
    this.initAddProductContent();
    this.listProductContent();
  }

  listProductContent() {
    this.productService.listProductContent(this.productId, this.language).subscribe(
      (result) => {
        this.productContent = result;
        this.productContent.reverse();
        this.productContent.forEach((item) => {
          if (item.file_path !== null) {
            item.file_path = this.productService.filePath(item.file_path);
          } else {

          }
        });
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
  }

  initAddProductContent() {
    this.updateMode = false;
    this.addOrUpdateButton = 'ثبت';
    this.addProductContentForm = this.formBuilder.group({
      title: ['',
        []
      ],
      content: ['',
        [
          Validators.required
        ]
      ],
      file_path: ['',
        []
      ],
      is_main_file: ['',
        []
      ],
      product_id: this.productId,
      language: this.language
    });
  }

  initUpdateProductContent(editData) {
    this.updateMode = true;
    this.addOrUpdateButton = 'ویرایش';
    this.addProductContentForm = this.formBuilder.group({
      title: [editData.title,
        []
      ],
      content: [editData.content,
        [
          Validators.required
        ]
      ],
      file_path: ['',
        []
      ],
      is_main_file: [editData.is_main_file,
        []
      ],
      product_id: this.productId,
      content_id: editData.content_id,
      former_file_path: editData.file_path,
      file_id: editData.file_id,
      product_details_files_id: editData.product_details_files_id

    });
  }

  onFileChange(event) {
    this.fileType = '';
    this.fileSize = 0;
    this.fileSrc = '';
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      this.myFile = event.target.files[0];
      reader.readAsDataURL(this.myFile);
      reader.onload = () => {
        this.fileType = this.myFile.type.split('/');
        this.fileSrc = reader.result as string;
        this.fileSize = Math.round((Number(this.myFile.size) / 1024) / 1024);
        this.notificationService.warn('حجم فایل ' + this.fileSize + 'MB');
      };
    }
  }

  updateProductContent(content) {
    this.initUpdateProductContent(content);
  }

  addProductContentFunc(value) {
    if (value.is_main_file === '' || value.is_main_file === null) {
      value.is_main_file = false;
    }
    if (this.updateMode === false) {
      if (value.file_path) {
        if (this.fileType[0] === 'video' || this.fileType[0] === 'image') {
          if (this.fileSize > 20) {
            this.notificationService.warn(generalMessages.fileSizeMessage);
          } else {
            this.loader.openLoader();
            const formData = new FormData();
            formData.append('file', this.myFile);
            formData.append('integratedFormData', JSON.stringify(this.addProductContentForm.value));
            this.productService.addProductContent(formData).subscribe(
              (storedData) => {
                this.productContent.push({
                  title: storedData.title,
                  content: storedData.content,
                  file_path: this.productService.filePath(storedData.file_path),
                  file_id: storedData.file_id,
                  product_id: storedData.product_id,
                  content_id: storedData.content_id,
                  is_main_file: storedData.is_main_file,
                  product_details_files_id: storedData.product_details_files_id

                });
                this.loader.closeLoader();
                this.initAddProductContent();
                this.notificationService.success(generalMessages.successInserted);
              }, (error: HttpErrorResponse) => {
                this.notificationService.warn(generalMessages.serverProblem);
                this.loader.closeLoader();
              });
          }
        } else {
          this.notificationService.warn('فایل باید تصویر یا ویدیو باشد!');

        }
      } else {
        this.loader.openLoader();
        this.productService.addProductContent(value).subscribe(
          (storedData) => {
            this.productContent.push({
              title: storedData.title,
              content: storedData.content,
              file_path: null,
              content_id: storedData.content_id,
              file_id: null,
              product_id: storedData.product_id,
              is_main_file: storedData.is_main_file
            });
            this.notificationService.success(generalMessages.successInserted);
            this.loader.closeLoader();
            this.initAddProductContent();
          }, (error: HttpErrorResponse) => {
            this.notificationService.warn(generalMessages.serverProblem);
            this.loader.closeLoader();

          });
      }
    } else {
      if (value.file_path) {
        if (this.fileType[0] === 'video' || this.fileType[0] === 'image') {
          if (this.fileSize > 20) {
            this.notificationService.warn(generalMessages.fileSizeMessage);
          } else {
            this.loader.openLoader();
            const formData = new FormData();
            formData.append('file', this.myFile);
            formData.append('integratedFormData', JSON.stringify(this.addProductContentForm.value));
            this.productService.updateProductContent(formData).subscribe(
              (updatedData) => {
                this.productContent.find(item => {
                  if (updatedData.content_id === item.content_id) {
                    item.title = updatedData.title;
                    item.content = updatedData.content;
                    item.file_path = this.productService.filePath(updatedData.file_path);
                    item.content_id = updatedData.content_id;
                    item.product_id = updatedData.product_id;
                    item.file_id = updatedData.file_id;
                    item.is_main_file = updatedData.is_main_file;
                    item.product_details_files_id = updatedData.product_details_files_id;

                  }
                });
                this.notificationService.success(generalMessages.successUpdated);
                this.initAddProductContent();
                this.loader.closeLoader();
              }, (error: HttpErrorResponse) => {
                this.notificationService.warn(generalMessages.serverProblem);
                this.loader.closeLoader();
              });
          }
        } else {
          this.notificationService.warn('فایل باید عکس باشد');
        }
      } else {
        this.productService.updateProductContent(value).subscribe(
          (updatedData) => {
            this.loader.openLoader();
            this.productContent.find(item => {
              if (updatedData.content_id === item.content_id) {
                item.title = updatedData.title;
                item.content = updatedData.content;
                item.file_path = null;
                item.content_id = updatedData.content_id;
                item.product_id = updatedData.product_id;
                item.file_id = null;
                item.is_main_file = updatedData.is_main_file;
              }
            });
            this.notificationService.success(generalMessages.successUpdated);
            this.initAddProductContent();
            this.loader.closeLoader();
          }, (error: HttpErrorResponse) => {
            this.notificationService.warn(generalMessages.serverProblem);
            this.loader.closeLoader();
          });
      }
    }
    this.fileSrc = null;
  }


  deleteThisSection(value) {
    this.dialogService.openConfirmDialog(generalMessages.confirmMessage).afterClosed().subscribe(
      res => {
        if (res) {
          this.productService.deleteProductContent(value).subscribe(
            (response) => {
              this.notificationService.success(generalMessages.successDeleted);
              this.productContent = this.productContent.filter((item) => item.content_id !== response.content_id);
            }, (error: HttpErrorResponse) => {
              this.notificationService.warn(generalMessages.serverProblem);
            });
        }
      }
    );
  }

  reset() {
    this.addProductContentForm.reset();
    this.fileSrc = '';
  }

  get f() {
    return this.addProductContentForm.controls;
  }

  isValid() {
    return this.addProductContentForm.valid;
  }
}
