import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {generalMessages, messages} from '../../../../../website/src/app/validation/commonErrorMessages';
import {NotificationService} from '../../services/notification.service';
import {LoaderService} from '../../services/loader.service';
import {DialogService} from '../../services/dialog.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {AboutUsService} from './about-us-.service';

export interface IAboutUs {
  id: number;
  title: string;
  link: string;
  content: string;
}

export interface IIAboutUsFile {
  about_us_id: number;
  file: any;
  isMainFile: boolean;
  path: string;
  id: number;
}

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  public Editor = ClassicEditor;
  aboutUsForm: FormGroup;
  aboutUsFileForm: FormGroup;
  errorMessages = messages;
  aboutUss;
  aboutUssFiles;
  isInsertMode = false;
  isInsertFileMode = false;
  isFileMode = false;
  aboutUsId;
  aboutUsFile;

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private aboutUsService: AboutUsService,
              private dialogService: DialogService) {

  }

  ngOnInit(): void {
    this.initCreateAboutUsForm();
    this.listAboutUs();
  }


  listAboutUs() {
    this.loader.openLoader();
    this.aboutUsService.listAboutUs().subscribe((res) => {
      this.loader.closeLoader();
      this.aboutUss = res;
      this.notificationService.success(generalMessages.reachedSuccess);
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });
  }

  listAboutUsFiles(aboutUsId: number) {
    this.aboutUsId = aboutUsId;
    this.initCreateAboutUsFileForm();
    this.loader.openLoader();
    this.aboutUsService.listAboutUsFiles(aboutUsId).subscribe((res) => {
      this.loader.closeLoader();
      this.isFileMode = true;
      this.isInsertMode = false;
      this.aboutUssFiles = res;
      this.aboutUssFiles.forEach((item) => {
        item.path = this.aboutUsService.filePath(item.path);
      });
      this.notificationService.success(generalMessages.reachedSuccess);
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });
  }

  initCreateAboutUsForm(): void {
    this.aboutUsForm = this.formBuilder.group({
      title: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      content: [null, [
        Validators.required,
        Validators.minLength(3),
      ]],
    });
  }

  initCreateAboutUsFileForm(): void {
    this.aboutUsFileForm = this.formBuilder.group({
      file: [null, [
        Validators.required
      ]],
      about_us_id: [this.aboutUsId],
    });
  }

  initUpdateAboutUsForm(data: IAboutUs): void {
    this.aboutUsForm = this.formBuilder.group({
      title: [data && data.title, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      content: [data && data.content, [
        Validators.required,
        Validators.minLength(3),
      ]],
      id: [data && data.id],
    });
  }

  createAndUpdate(aboutUsForm): void {
    if (aboutUsForm) {
      this.loader.openLoader();
      if (!aboutUsForm.value.id) {
        this.aboutUsService.store(aboutUsForm.value).subscribe((res) => {
          this.loader.closeLoader();
          this.initCreateAboutUsForm();
          this.notificationService.success(generalMessages.successInserted);
          this.isInsertMode = false;
          this.aboutUss.push(res);
          this.aboutUss.reverse();
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      } else {
        this.aboutUsService.update(aboutUsForm.value).subscribe((res) => {
          this.loader.closeLoader();
          this.initCreateAboutUsForm();
          this.notificationService.success(generalMessages.successInserted);
          this.isInsertMode = false;
          this.aboutUss.filter((item) => {
            if (item.id === aboutUsForm.value.id) {
              item.title = aboutUsForm.value.title;
              item.content = aboutUsForm.value.content;
              item.link = aboutUsForm.value.link;
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

  deleteAboutUs(id: number) {
    this.dialogService.openConfirmDialog(generalMessages.doUWantDelete).afterClosed().subscribe(res => {
      if (res) {
        this.aboutUsService.delete(id).subscribe((item) => {
          this.loader.closeLoader();
          this.notificationService.success(generalMessages.successInserted);
          this.aboutUss = this.aboutUss.filter((pro) => {
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
    return this.aboutUsForm.controls;
  }

  get pf() {
    return this.aboutUsFileForm.controls;
  }

  isValid() {
    return this.aboutUsForm.valid;
  }

  isFileValid() {
    return this.aboutUsFileForm.valid;
  }

  insertMode() {
    this.isInsertMode = true;
  }

  insertFileMode() {
    this.isInsertFileMode = true;
  }

  fileMode(aboutUsId: number) {
    this.listAboutUsFiles(aboutUsId);
    this.isFileMode = true;
  }

  updateMode(value: IAboutUs) {
    this.isInsertMode = true;
    this.initUpdateAboutUsForm(value);
  }

  storeFile(aboutUsFileForm) {
    const formData = new FormData();
    if (this.aboutUsFile) {
      formData.append('file', this.aboutUsFile);
    }
    aboutUsFileForm.value.isMainFile === 'true' ? aboutUsFileForm.value.isMainFile = true : aboutUsFileForm.value.isMainFile = false;
    formData.append('integratedFormData', JSON.stringify(aboutUsFileForm.value));
    this.aboutUsService.storeFile(formData).subscribe((res) => {
      this.loader.closeLoader();
      this.initCreateAboutUsFileForm();
      this.notificationService.success(generalMessages.successInserted);
      this.isInsertFileMode = false;
      res.path = this.aboutUsService.filePath(res.path);
      this.aboutUssFiles.push(res);
      this.aboutUssFiles.reverse();
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });


  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.aboutUsFile = event.target.files[0];
    }
  }

  deleteAboutUsFile(id: number) {
    this.dialogService.openConfirmDialog(generalMessages.doUWantDelete).afterClosed().subscribe(res => {
      if (res) {
        this.aboutUsService.deleteFile(id).subscribe((item) => {
          this.loader.closeLoader();
          this.notificationService.success(generalMessages.successInserted);
          this.aboutUssFiles = this.aboutUssFiles.filter((pro) => {
            return pro.id !== id;
          });
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      }
    });
  }

  back() {
    this.isFileMode = false;
    this.isInsertFileMode = false;
  }



}
