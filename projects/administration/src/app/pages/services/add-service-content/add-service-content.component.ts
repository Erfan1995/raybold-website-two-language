import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {environment as localEnvironment} from '../../../../environments/environment';
import {environment as productionEnvironment} from '../../../../environments/environment.prod';
import {generalMessages, messages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ActivatedRoute} from '@angular/router';
import {DropDownService} from '../../../services/drop-down.service';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {DialogService} from '../../../services/dialog.service';
import {ServicesService} from '../services.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-add-service-content',
  templateUrl: './add-service-content.component.html',
  styleUrls: ['./add-service-content.component.css']
})
export class AddServiceContentComponent implements OnInit {
  serviceId;
  serviceTitle;
  fileSrc;
  addServiceContentForm: FormGroup;
  public Editor = ClassicEditor;
  myFile;
  serviceContent = [];
  env = localEnvironment || productionEnvironment;
  errorMessages = messages;
  fileType = '';
  fileSize;
  updateMode = false;
  addOrUpdateButton = 'اضافه نمودن محتوا';

  constructor(private activatedRoute: ActivatedRoute,
              private dropDownServices: DropDownService,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private servicesService: ServicesService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.serviceId = this.activatedRoute.snapshot.params.id;
    this.serviceTitle = this.activatedRoute.snapshot.params.title;
    this.initAddServiceContent();
    this.listServiceContent();
  }

  listServiceContent() {
    this.servicesService.listServiceContent(this.serviceId).subscribe(
      (result) => {
        this.serviceContent = result;
        this.serviceContent.reverse();
        this.serviceContent.forEach((item) => {
          if (item.file_path !== null) {
            item.file_path = this.env.baseUrl.backend.main + this.servicesService.filePath(item.file_path);
          } else {

          }
        });
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
  }

  initAddServiceContent() {
    this.updateMode = false;
    this.addOrUpdateButton = 'ثبت';
    this.addServiceContentForm = this.formBuilder.group({
      subtitle: ['',
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
      service_id: this.serviceId

    });
  }

  initUpdateServiceContent(editData) {
    this.updateMode = true;
    this.addOrUpdateButton = 'ویرایش';
    this.addServiceContentForm = this.formBuilder.group({
      subtitle: [editData.subtitle,
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
      service_id: this.serviceId,
      content_id: editData.content_id,
      former_file_path: editData.file_path,
      file_id: editData.file_id,
      service_details_files_id: editData.service_details_files_id

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

  updateServiceContent(content) {
    this.initUpdateServiceContent(content);
  }

  addServiceContentFunc(value) {
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
            formData.append('integratedFormData', JSON.stringify(this.addServiceContentForm.value));
            this.servicesService.addServiceContent(formData).subscribe(
              (storedData) => {
                this.serviceContent.push({
                  subtitle: storedData.subtitle,
                  content: storedData.content,
                  file_path: this.env.baseUrl.backend.main + this.servicesService.filePath(storedData.file_path),
                  file_id: storedData.file_id,
                  service_id: storedData.service_id,
                  content_id: storedData.content_id,
                  is_main_file: storedData.is_main_file,
                  service_details_files_id: storedData.service_details_files_id

                });
                this.loader.closeLoader();
                this.initAddServiceContent();
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
        this.servicesService.addServiceContent(value).subscribe(
          (storedData) => {
            this.serviceContent.push({
              subtitle: storedData.subtitle,
              content: storedData.content,
              file_path: null,
              content_id: storedData.content_id,
              file_id: null,
              service_id: storedData.service_id,
              is_main_file: storedData.is_main_file
            });
            this.notificationService.success(generalMessages.successInserted);
            this.loader.closeLoader();
            this.initAddServiceContent();
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
            formData.append('integratedFormData', JSON.stringify(this.addServiceContentForm.value));
            this.servicesService.updateServiceContent(formData).subscribe(
              (updatedData) => {
                this.serviceContent.find(item => {
                  if (updatedData.content_id === item.content_id) {
                    item.subtitle = updatedData.subtitle;
                    item.content = updatedData.content;
                    item.file_path = this.env.baseUrl.backend.main + this.servicesService.filePath(updatedData.file_path);
                    item.content_id = updatedData.content_id;
                    item.service_id = updatedData.service_id;
                    item.file_id = updatedData.file_id;
                    item.is_main_file = updatedData.is_main_file;
                    item.service_details_files_id = updatedData.service_details_files_id;

                  }
                });
                this.notificationService.success(generalMessages.successUpdated);
                this.initAddServiceContent();
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
        this.servicesService.updateServiceContent(value).subscribe(
          (updatedData) => {
            this.loader.openLoader();
            this.serviceContent.find(item => {
              if (updatedData.content_id === item.content_id) {
                item.subtitle = updatedData.subtitle;
                item.content = updatedData.content;
                item.file_path = null;
                item.content_id = updatedData.content_id;
                item.service_id = updatedData.service_id;
                item.file_id = null;
                item.is_main_file = updatedData.is_main_file;
              }
            });
            this.notificationService.success(generalMessages.successUpdated);
            this.initAddServiceContent();
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
          this.servicesService.deleteServiceContent(value).subscribe(
            (response) => {
              this.notificationService.success(generalMessages.successDeleted);
              this.serviceContent = this.serviceContent.filter((item) => item.content_id !== response.content_id);
            }, (error: HttpErrorResponse) => {
              this.notificationService.warn(generalMessages.serverProblem);
            });
        }
      }
    );
  }

  reset() {
    this.addServiceContentForm.reset();
    this.fileSrc = '';
  }

  get f() {
    return this.addServiceContentForm.controls;
  }

  isValid() {
    return this.addServiceContentForm.valid;
  }
}
