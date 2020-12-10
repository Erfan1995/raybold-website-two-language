import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../services/notification.service';
import {LoaderService} from '../../services/loader.service';
import {DialogService} from '../../services/dialog.service';
import {ProjectsService} from './projects.service';
import {generalMessages, messages} from '../../../../../website/src/app/validation/commonErrorMessages';

export interface IProject {
  id: number;
  title: string;
  link: string;
  service_id: number;
  file: string;
  path: string;
  file_id: number;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})


export class ProjectsComponent implements OnInit {
  projectForm: FormGroup;
  projectFileForm: FormGroup;
  errorMessages = messages;
  projects;
  isInsertMode = false;
  isFileMode = false;
  isInsertFileMode = false;
  projectFiles;
  services;
  projectId;
  projectFile;
  addOrUpdateButton = '';

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private projectService: ProjectsService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.listServices();
    this.initCreateProjectForm();
    this.initCreateProjectFileForm();
    this.listProjects();
  }

  listServices() {
    this.loader.openLoader();
    this.projectService.listServices().subscribe((res) => {
      this.loader.closeLoader();
      this.services = res;
      this.notificationService.success(generalMessages.reachedSuccess);
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });
  }

  getServiceName(id: number) {
    const item = this.services.filter((current) => {
      return current.id === Number(id.toString());
    });
    return item[0];
  }

  listProjects() {
    this.loader.openLoader();
    this.projectService.listProjects().subscribe((res) => {
      this.loader.closeLoader();
      this.projects = res;
      this.notificationService.success(generalMessages.reachedSuccess);
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });
  }

  listProjectFiles(projectId: number) {
    this.projectId = projectId;
    this.initCreateProjectFileForm();
    this.loader.openLoader();
    this.projectService.listProjectFiles(projectId).subscribe((res) => {
      this.isFileMode = true;
      this.isInsertMode = false;
      this.projectFiles = res;
      this.projectFiles.forEach((item) => {
        item.path = this.projectService.filePath(item.path);
      });
      this.notificationService.success(generalMessages.reachedSuccess);
      this.loader.closeLoader();
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });
  }

  initCreateProjectForm(): void {
    this.addOrUpdateButton = 'ثبت';
    this.projectForm = this.formBuilder.group({
      title: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      link: [null, [
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      service_id: [null,
        [
          Validators.required
        ]]
    });
  }

  initCreateProjectFileForm(): void {
    this.projectFileForm = this.formBuilder.group({
      file: [null, [
        Validators.required
      ]],
      isMainFile: [null, [
        Validators.required
      ]],
      project_id: [this.projectId],
    });
  }

  initUpdateProjectForm(data: IProject): void {
    this.addOrUpdateButton = 'بروز رسانی';
    this.projectForm = this.formBuilder.group({
      title: [data && data.title, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      link: [data && data.link, [
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      service_id: [data && data.service_id,
        [
          Validators.required
        ]],
      id: [data && data.id],
    });
  }

  addOrUpdateProject(projectForm) {
    if (projectForm) {
      this.loader.openLoader();
      if (!projectForm.value.id) {
        this.projectService.store(projectForm.value).subscribe((res) => {
          this.initCreateProjectForm();
          this.notificationService.success(generalMessages.successInserted);
          this.isInsertMode = false;
          this.projects.push(res);
          this.projects.reverse();
          this.loader.closeLoader();
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      } else {
        this.projectService.update(projectForm.value).subscribe((res) => {
          this.initCreateProjectForm();
          this.notificationService.success(generalMessages.successInserted);
          this.isInsertMode = false;
          this.projects.filter((item) => {
            if (item.id === projectForm.value.id) {
              item.title = projectForm.value.title;
              item.link = projectForm.value.link;
              item.service_id = projectForm.value.service_id;
            }
          });
          this.loader.closeLoader();
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      }
    } else {
      this.notificationService.warn(generalMessages.validation);
    }

  }

  deleteProject(id: number) {
    this.dialogService.openConfirmDialog(generalMessages.doUWantDelete).afterClosed().subscribe(res => {
      if (res) {
        this.projectService.delete(id).subscribe((item) => {
          this.loader.closeLoader();
          this.notificationService.success(generalMessages.successInserted);
          this.projects = this.projects.filter((pro) => {
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
    return this.projectForm.controls;
  }

  get pf() {
    return this.projectFileForm.controls;
  }

  isValid() {
    return this.projectForm.valid;
  }

  isFileValid() {
    return this.projectFileForm.valid;
  }

  updateMode(value) {
    this.isInsertMode = true;
    this.initUpdateProjectForm(value);
  }

  insertFileMode() {
    this.isInsertFileMode = true;
  }

  insertMode() {
    this.isInsertMode = true;
  }

  fileMode(productId: number) {
    this.listProjectFiles(productId);
    this.isFileMode = true;
  }

  storeFile(productFileForm) {
    const formData = new FormData();
    if (this.projectFile) {
      formData.append('file', this.projectFile);
    }
    this.loader.openLoader();
    productFileForm.value.isMainFile === 'true' ? productFileForm.value.isMainFile = true : productFileForm.value.isMainFile = false;
    formData.append('integratedFormData', JSON.stringify(productFileForm.value));
    this.projectService.storeFile(formData).subscribe((res) => {
      this.loader.closeLoader();
      this.initCreateProjectFileForm();
      this.notificationService.success(generalMessages.successInserted);
      this.isInsertFileMode = false;
      res.path = this.projectService.filePath(res.path);
      this.projectFiles.push(res);
      this.projectFiles.reverse();
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });


  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.projectFile = event.target.files[0];
    }
  }

  back() {
    this.isFileMode = false;
    this.isInsertFileMode = false;
  }

  deleteProjectFile(id: number, projectFileId: number) {
    this.dialogService.openConfirmDialog(generalMessages.doUWantDelete).afterClosed().subscribe(res => {
      if (res) {
        this.projectService.deleteFile(id, projectFileId).subscribe((item) => {
          this.loader.closeLoader();
          this.notificationService.success(generalMessages.successInserted);
          this.projectFiles = this.projectFiles.filter((pro) => {
            return pro.id !== id;
          });
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      }
    });
  }

}
