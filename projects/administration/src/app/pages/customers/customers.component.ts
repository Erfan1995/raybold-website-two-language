import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {generalMessages, messages} from '../../../../../website/src/app/validation/commonErrorMessages';
import {NotificationService} from '../../services/notification.service';
import {LoaderService} from '../../services/loader.service';
import {DialogService} from '../../services/dialog.service';
import {CustomerService} from './customer.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export interface ICustomer {
  id: number;
  title: string;
  link: string;
  file: string;
  path: string;
  file_id: number;
  review: string;
  language: string;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  public Editor = ClassicEditor;

  customerForm: FormGroup;
  errorMessages = messages;
  customers;
  isInsertMode = false;
  isFileMode = false;
  customerFile;
  imgFull;

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private customerService: CustomerService,
              private dialogService: DialogService) {

  }

  ngOnInit(): void {
    this.initCreateCustomerForm();
    this.listCustomers();
  }


  listCustomers() {
    this.loader.openLoader();
    this.customerService.listCustomers().subscribe((res) => {
      this.loader.closeLoader();
      this.customers = res;
      this.customers.forEach((item) => {
        item.path = this.customerService.filePath(item.path);
      });
      this.notificationService.success(generalMessages.reachedSuccess);
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });
  }

  initCreateCustomerForm(): void {
    this.customerForm = this.formBuilder.group({
      title: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      link: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      language: [null, [
        Validators.required,
      ]],
      file: [null, [
        Validators.required,
      ]],
      review: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(500)
      ]],
    });
  }


  initUpdateCustomerForm(data: ICustomer): void {
    this.customerForm = this.formBuilder.group({
      title: [data && data.title, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      link: [data && data.link, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      review: [data && data.review, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(500)
      ]],
      file: [''],
      id: [data && data.id],
      file_id: [data && data.file_id],
      language: [data && data.language]
    });
  }

  createAndUpdate(customerForm): void {
    if (customerForm) {
      const formData = new FormData();
      if (this.customerFile) {
        formData.append('file', this.customerFile);
      }
      formData.append('integratedFormData', JSON.stringify(customerForm.value));
      this.loader.openLoader();
      if (!customerForm.value.id) {
        this.customerService.store(formData).subscribe((res) => {
          this.loader.closeLoader();
          this.initCreateCustomerForm();
          this.notificationService.success(generalMessages.successInserted);
          this.isInsertMode = false;
          res.path = this.customerService.filePath(res.path);
          this.customers.push(res);
          this.customers.reverse();
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      } else {
        this.customerService.update(formData).subscribe((res) => {
          this.loader.closeLoader();
          this.initCreateCustomerForm();
          this.notificationService.success(generalMessages.successInserted);
          this.isInsertMode = false;
          this.isFileMode = false;
          this.customers.filter((item) => {
            if (item.id === customerForm.value.id) {
              item.title = customerForm.value.title;
              item.review = customerForm.value.review;
              item.language = customerForm.value.language;
              item.link = customerForm.value.link;
              if (res.path) {
                item.path = this.customerService.filePath(res.path);
              }
            }
          });
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      }
    } else {
      this.notificationService.warn(generalMessages.validation);
    }

  }

  deleteCustomer(id: number) {
    this.dialogService.openConfirmDialog(generalMessages.doUWantDelete).afterClosed().subscribe(res => {
      if (res) {
        this.customerService.delete(id).subscribe((item) => {
          this.loader.closeLoader();
          this.notificationService.success(generalMessages.successInserted);
          this.customers = this.customers.filter((pro) => {
            return pro.id !== id;
          });
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      }
    });
  }

  get f() {
    return this.customerForm.controls;
  }

  isValid() {
    return this.customerForm.valid;
  }

  insertMode() {
    this.isInsertMode = true;
  }


  fileMode(image: number) {
    this.imgFull = image;
    this.isFileMode = true;
  }

  updateMode(value: ICustomer) {
    this.isInsertMode = true;
    this.initUpdateCustomerForm(value);
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.customerFile = event.target.files[0];
    }
  }

  back() {
    this.isFileMode = false;
  }
}
