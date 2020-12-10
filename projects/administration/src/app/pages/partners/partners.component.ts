import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {generalMessages, messages} from '../../../../../website/src/app/validation/commonErrorMessages';
import {NotificationService} from '../../services/notification.service';
import {LoaderService} from '../../services/loader.service';
import {DialogService} from '../../services/dialog.service';
import {PartnersService} from './partners.service';

export interface IPartner {
  id: number;
  title: string;
  link: string;
  file: string;
  path: string;
  files_id: number;
}

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {

  partnerForm: FormGroup;
  errorMessages = messages;
  partners;
  isInsertMode = false;
  isFileMode = false;
  partnerFile;
  imgFull;

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private partnerService: PartnersService,
              private dialogService: DialogService) {

  }

  ngOnInit(): void {
    this.initCreatePartnerForm();
    this.listPartners();
  }


  listPartners() {
    this.loader.openLoader();
    this.partnerService.listPartners().subscribe((res) => {
      this.loader.closeLoader();
      this.partners = res;
      this.partners.forEach((item) => {
        item.path = this.partnerService.filePath(item.path);
      });
      this.notificationService.success(generalMessages.reachedSuccess);
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });
  }

  initCreatePartnerForm(): void {
    this.partnerForm = this.formBuilder.group({
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
      file: [null, [
        Validators.required,
      ]],
    });
  }


  initUpdatePartnerForm(data: IPartner): void {
    this.partnerForm = this.formBuilder.group({
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
      file: [''],
      id: [data && data.id],
      files_id: [data && data.files_id],
    });
  }

  createAndUpdate(partnerForm): void {
    if (partnerForm) {
      const formData = new FormData();
      if (this.partnerFile) {
        formData.append('file', this.partnerFile);
      }
      formData.append('integratedFormData', JSON.stringify(partnerForm.value));
      this.loader.openLoader();
      if (!partnerForm.value.id) {
        this.partnerService.store(formData).subscribe((res) => {
          this.loader.closeLoader();
          this.initCreatePartnerForm();
          this.notificationService.success(generalMessages.successInserted);
          this.isInsertMode = false;
          res.path = this.partnerService.filePath(res.path);
          this.partners.push(res);
          this.partners.reverse();
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      } else {
        this.partnerService.update(formData).subscribe((res) => {
          this.loader.closeLoader();
          this.initCreatePartnerForm();
          this.notificationService.success(generalMessages.successInserted);
          this.isInsertMode = false;
          this.isFileMode = false;
          this.partners.filter((item) => {
            if (item.id === partnerForm.value.id) {
              item.title = partnerForm.value.title;
              item.link = partnerForm.value.link;
              if (res.path) {
                item.path = this.partnerService.filePath(res.path);
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

  deletePartner(id: number) {
    this.dialogService.openConfirmDialog(generalMessages.doUWantDelete).afterClosed().subscribe(res => {
      if (res) {
        this.partnerService.delete(id).subscribe((item) => {
          this.loader.closeLoader();
          this.notificationService.success(generalMessages.successInserted);
          this.partners = this.partners.filter((pro) => {
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
    return this.partnerForm.controls;
  }

  isValid() {
    return this.partnerForm.valid;
  }

  insertMode() {
    this.isInsertMode = true;
  }


  fileMode(image: number) {
    this.imgFull = image;
    this.isFileMode = true;
  }

  updateMode(value: IPartner) {
    this.isInsertMode = true;
    this.initUpdatePartnerForm(value);
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.partnerFile = event.target.files[0];
    }
  }

  back() {
    this.isFileMode = false;
  }
}
