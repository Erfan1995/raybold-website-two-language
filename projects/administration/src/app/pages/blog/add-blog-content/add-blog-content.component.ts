import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DropDownService} from '../../../services/drop-down.service';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {BlogService} from '../blog.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {environment as localEnvironment} from '../../../../environments/environment';
import {environment as productionEnvironment} from '../../../../environments/environment.prod';
import {HttpErrorResponse} from '@angular/common/http';
import {generalMessages, messages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {DialogService} from '../../../services/dialog.service';

@Component({
  selector: 'app-add-blog-content',
  templateUrl: './add-blog-content.component.html',
  styleUrls: ['./add-blog-content.component.css']
})
export class AddBlogContentComponent implements OnInit {
  blogId;
  blogTitle;
  imageSrc;
  addBlogContentForm: FormGroup;
  public Editor = ClassicEditor;
  myFile;
  blogContent = [];
  env = localEnvironment || productionEnvironment;
  errorMessages = messages;
  fileType;
  updateMode = false;
  addOrUpdateButton = 'اضافه نمودن محتوا';
  language;

  constructor(private activatedRoute: ActivatedRoute,
              private dropDownServices: DropDownService,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private blogService: BlogService,
              private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.blogId = this.activatedRoute.snapshot.params.id;
    this.blogTitle = this.activatedRoute.snapshot.params.title;
    this.language = this.activatedRoute.snapshot.params.language;
    this.listBlogContent();
    this.initAddBlogContent();
  }

  listBlogContent() {
    this.blogService.listBlogContent(this.blogId).subscribe(
      (result) => {
        this.blogContent = result;
        this.blogContent.reverse();
        this.blogContent.forEach((item) => {
          if (item.image_path !== null) {
            item.image_path = this.env.baseUrl.backend.main + this.blogService.filePath(item.image_path);
          } else {

          }
        });
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
  }

  initAddBlogContent() {
    this.updateMode = false;
    this.addOrUpdateButton = 'ثبت';
    this.addBlogContentForm = this.formBuilder.group({
      title: ['',
        []
      ],
      content: ['',
        [
          Validators.required
        ]
      ],
      image_path: ['',
        []
      ],
      is_main_file: [],
      blog_id: this.blogId,
      language: this.language

    });
  }

  editThisSection(value) {
    this.initUpdateBlogContent(value);
  }

  initUpdateBlogContent(editData) {
    this.updateMode = true;
    this.addOrUpdateButton = 'ویرایش';
    this.addBlogContentForm = this.formBuilder.group({
      title: [editData.title,
        []
      ],
      content: [editData.content,
        [
          Validators.required
        ]
      ],
      image_path: ['',
        []
      ],
      is_main_file: [editData.is_main_file,
        []
      ],
      blog_id: this.blogId,
      content_id: editData.content_id,
      former_image_path: editData.image_path,
      file_id: editData.file_id,
      blog_details_files_id: editData.blog_details_files_id,
    });
  }

  onFileChange(event) {
    this.fileType = '';
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      this.myFile = event.target.files[0];
      this.fileType = this.myFile.type.split('/');
      if (this.fileType[0] === 'image') {
        reader.readAsDataURL(this.myFile);
        reader.onload = () => {
          this.imageSrc = reader.result as string;
        };
      } else {
        this.notificationService.warn('فایل باید عکس باشد');
      }

    }
  }

  addBlogContentFunc(value) {
    if (value.is_main_file === '' || value.is_main_file === null) {
      value.is_main_file = false;
    }
    if (this.updateMode === false) {
      if (value.image_path) {
        if (this.fileType[0] === 'image') {
          this.loader.openLoader();
          const formData = new FormData();
          formData.append('file', this.myFile);
          formData.append('integratedFormData', JSON.stringify(this.addBlogContentForm.value));
          this.blogService.addBlogContent(formData).subscribe(
            (storedData) => {
              if (storedData) {
                this.blogContent.push({
                  title: storedData.title,
                  content: storedData.content,
                  image_path: this.env.baseUrl.backend.main + this.blogService.filePath(storedData.image_path),
                  content_id: storedData.content_id,
                  file_id: storedData.file_id,
                  blog_id: storedData.blog_id,
                  is_main_file: storedData.is_main_file,
                  blog_details_files_id: storedData.blog_details_files_id

                });
                this.notificationService.success(generalMessages.successInserted);
                this.initAddBlogContent();
                this.loader.closeLoader();
              }
            }, (error: HttpErrorResponse) => {
              this.notificationService.warn(generalMessages.serverProblem);
              this.loader.closeLoader();
            });
        } else {
          this.notificationService.warn('فایل باید عکس باشد');
        }
      } else {
        this.loader.openLoader();
        this.blogService.addBlogContent(value).subscribe(
          (storedData) => {
            if (storedData) {
              this.blogContent.push({
                title: storedData.title,
                content: storedData.content,
                image_path: null,
                content_id: storedData.content_id,
                file_id: null,
                blog_id: storedData.blog_id,
                is_main_file: storedData.is_main_file
              });
              this.initAddBlogContent();
              this.loader.closeLoader();
            }
          }, (error: HttpErrorResponse) => {
            this.notificationService.warn(generalMessages.serverProblem);
            this.loader.closeLoader();
          });
      }
    } else {

      if (value.image_path) {
        if (this.fileType[0] === 'image') {
          this.loader.openLoader();

          const formData = new FormData();
          formData.append('file', this.myFile);
          formData.append('integratedFormData', JSON.stringify(this.addBlogContentForm.value));
          this.blogService.updateBlogContent(formData).subscribe(
            (updatedData) => {
              if (updatedData) {
                this.blogContent.find(item => {
                  if (updatedData.content_id === item.content_id) {
                    item.title = updatedData.title;
                    item.content = updatedData.content;
                    item.image_path = this.env.baseUrl.backend.main + this.blogService.filePath(updatedData.image_path);
                    item.content_id = updatedData.content_id;
                    item.blog_id = updatedData.blog_id;
                    item.file_id = updatedData.file_id;
                    item.is_main_file = updatedData.is_main_file;
                    item.blog_details_files_id = updatedData.blog_details_files_id;
                  }
                });
                this.notificationService.success(generalMessages.successUpdated);
                this.initAddBlogContent();
                this.loader.closeLoader();

              }
            }, (error: HttpErrorResponse) => {
              this.notificationService.warn(generalMessages.serverProblem);
              this.loader.closeLoader();

            });
        } else {
          this.notificationService.warn('فایل باید عکس باشد');
        }
      } else {
        this.loader.openLoader();
        this.blogService.updateBlogContent(value).subscribe(
          (updatedData) => {
            this.blogContent.find(item => {
              if (updatedData.content_id === item.content_id) {
                item.title = updatedData.title;
                item.content = updatedData.content;
                item.image_path = null;
                item.content_id = updatedData.content_id;
                item.blog_id = updatedData.blog_id;
                item.file_id = null;
                item.is_main_file = updatedData.is_main_file;
              }
            });
            this.initAddBlogContent();
            this.loader.closeLoader();

          }, (error: HttpErrorResponse) => {
            this.notificationService.warn(generalMessages.serverProblem);
            this.loader.closeLoader();

          });
      }
    }
    this.imageSrc = null;
  }

  deleteThisSection(value) {
    this.dialogService.openConfirmDialog(generalMessages.confirmMessage)
      .afterClosed().subscribe(res => {
      if (res) {
        this.blogService.deleteBlogContent(value).subscribe(
          (response) => {
            this.notificationService.success(generalMessages.successDeleted);
            this.blogContent = this.blogContent.filter((item) => item.content_id !== response.content_id);
          }, (error: HttpErrorResponse) => {
            this.notificationService.warn(generalMessages.serverProblem);
          });
      }
    });
  }

  reset() {
    this.addBlogContentForm.reset();
    this.imageSrc = '';
  }

  get f() {
    return this.addBlogContentForm.controls;
  }

  isValid() {
    return this.addBlogContentForm.valid;
  }
}
