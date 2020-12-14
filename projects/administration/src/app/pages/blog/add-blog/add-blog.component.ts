import {Component, OnInit} from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DropDownService} from '../../../services/drop-down.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {BlogService} from '../blog.service';
import {generalMessages, messages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {BlogInfoType} from '../blog.type';
import {HttpErrorResponse} from '@angular/common/http';
import {EditBlogComponent} from '../edit-blog/edit-blog.component';
import {DialogService} from '../../../services/dialog.service';
import {BlogTagsDialogComponent} from '../blog-tags-dialog/blog-tags-dialog.component';
import {AuthService} from '../../../services/auth.service';
import {iterator} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit {
  blogCategory;
  public Editor = ClassicEditor;
  blogInfoForm: FormGroup;
  blogInfoList;
  errorMessages = messages;
  blogListItemRange = 0;
  blogList = [];

  constructor(public dropDownServices: DropDownService,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private blogService: BlogService,
              private dialog: MatDialog,
              private dialogService: DialogService,
              private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.listBlogInfo(this.blogListItemRange);
    this.blogCategory = this.dropDownServices.getAll('blogCategory');
    this.initAddBlogInfo();
  }

  initAddBlogInfo() {
    this.blogInfoForm = this.formBuilder.group({
      title: ['',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(3)
        ]
      ],
      blog_category_id: ['',
        [
          Validators.required
        ]
      ],
      language: ['',
        [
          Validators.required
        ]
      ],
      blog_resource: ['',
        []
      ]
    });
  }

  listBlogInfo(blogItemNumber) {
    this.loader.openLoader();
    this.blogService.listBlogInfo(blogItemNumber, this.authService.getCurrentUser.user_id).subscribe(
      (result: BlogInfoType) => {
        this.blogInfoList = result;
        for (const blog of this.blogInfoList) {
          this.blogList.push({
            blog_category_id: blog.blog_category_id,
            blog_resource: blog.blog_resource,
            blog_status_id: blog.blog_status_id,
            created_at: blog.created_at,
            language: blog.language,
            id: blog.id,
            title: blog.title,
            user_id: blog.user_id
          });
        }
        this.loader.closeLoader();
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
    this.loader.closeLoader();
  }

  viewMoreBlog() {
    this.blogListItemRange += this.blogInfoList.length;
    this.listBlogInfo(this.blogListItemRange);
  }

  addBlog(value) {
    value.user_id = this.authService.getCurrentUser.user_id;
    value.blog_status_id = 1;
    this.loader.openLoader();
    this.blogService.addBlogInfo(value).subscribe(
      (result: BlogInfoType) => {
        if (result) {
          this.blogList.push({
            title: result.title,
            id: result.id,
            blog_category_id: result.blog_category_id,
            blog_status_id: result.blog_status_id,
            blog_resource: result.blog_resource,
            user_id: result.user_id,
            language: result.language,
            created_at: result.created_at
          });
        }
        this.notificationService.success(generalMessages.successInserted);
        this.initAddBlogInfo();
        this.blogList.reverse();
        this.loader.closeLoader();
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
    this.loader.closeLoader();

  }

  editBlogInfo(blogInfo) {
    const dialogRef = this.dialog.open(EditBlogComponent, {
      height: '500px',
      width: '600px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'backdropBackground',
      data: {editData: blogInfo}
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.blogInfoList.find(item => {
            if (result.id === item.id) {
              item.title = result.title;
              item.blog_category_id = result.blog_category_id;
              item.blog_resource = result.blog_resource;
              item.language = result.language;
            }
          });
        }
      }
    );
  }

  deleteBlog(blogInfo) {
    this.dialogService.openConfirmDialog(generalMessages.confirmMessage)
      .afterClosed().subscribe(
      res => {
        if (res) {
          this.blogService.deleteBlogInfo(blogInfo).subscribe(
            response => {
              this.notificationService.success(generalMessages.successDeleted);
              this.blogInfoList = this.blogInfoList.filter((item) => item.id !== response.id);
            }, (error: HttpErrorResponse) => {
              this.notificationService.warn(generalMessages.serverProblem);
            });
        }
      }
    );
  }

  openBlogTagsDialog(blogId, language) {
    const dialogRef = this.dialog.open(BlogTagsDialogComponent, {
      height: '700px',
      width: '600px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'backdropBackground',
      data: {editData: blogId, lan: language}
    });
  }

  reset() {
    this.blogInfoForm.reset();
  }

  get f() {
    return this.blogInfoForm.controls;
  }

  isValid() {
    return this.blogInfoForm.valid;
  }


}
