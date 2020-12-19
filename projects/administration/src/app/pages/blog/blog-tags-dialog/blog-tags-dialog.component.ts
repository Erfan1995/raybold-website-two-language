import {Component, Inject, OnInit} from '@angular/core';
import {generalMessages, messages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DropDownService} from '../../../services/drop-down.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {BlogService} from '../blog.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DialogService} from '../../../services/dialog.service';

@Component({
  selector: 'app-blog-tags-dialog',
  templateUrl: './blog-tags-dialog.component.html',
  styleUrls: ['./blog-tags-dialog.component.css']
})
export class BlogTagsDialogComponent implements OnInit {
  errorMessages = messages;
  blogTagForm: FormGroup;
  blogTags;
  updateMode = false;
  addOrUpdateButton = '';

  constructor(public dialogRef: MatDialogRef<BlogTagsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private dropDownServices: DropDownService,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private blogService: BlogService,
              private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.listBlogTags();
    this.initAddBlogTag();
  }

  listBlogTags() {
    this.blogService.lisTags(this.data.editData, this.data.lan).subscribe(
      result => {
        if (result) {
          this.blogTags = result;
          this.notificationService.success(generalMessages.reachedSuccess);
        }
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
  }

  initAddBlogTag() {
    this.updateMode = false;
    this.addOrUpdateButton = 'ثبت';
    this.blogTagForm = this.formBuilder.group({
      name: ['',
        [
          Validators.required
        ]

      ],
      blog_id: this.data.editData,
      language: this.data.lan
    });
  }

  initUpdateBlogTag(data) {
    this.updateMode = true;
    this.addOrUpdateButton = 'ویرایش';
    this.blogTagForm = this.formBuilder.group({
      name: [data.name,
        [
          Validators.required
        ]

      ],
      blog_id: data.id,
      id: data.id
    });
  }

  addBlogTag(value) {
    value.language = this.data.lan;
    if (this.updateMode === false) {
      this.blogService.addBlogTag(value).subscribe(
        result => {
          if (result) {
            this.blogTags.push(result);
            this.notificationService.success(generalMessages.successInserted);
          }
          this.initAddBlogTag();
        }, (error: HttpErrorResponse) => {
          this.notificationService.warn(generalMessages.serverProblem);
        });
    } else {
      this.blogService.updateBlogTag(value).subscribe(
        result => {
          if (result) {
            this.blogTags.find(item => {
              if (item.id === result.id) {
                item.name = result.name;
              }
              this.initAddBlogTag();
              this.notificationService.success(generalMessages.successUpdated);
            });
          }
        }, (error: HttpErrorResponse) => {
          this.notificationService.warn(generalMessages.serverProblem);
        });
    }

  }

  editBlogTag(value) {
    this.initUpdateBlogTag(value);
  }

  deleteBlogTag(value) {
    this.dialogService.openConfirmDialog(generalMessages.confirmMessage)
      .afterClosed().subscribe(
      res => {
        if (res) {
          this.blogService.deleteBlogTag(value).subscribe(
            response => {
              this.notificationService.success(generalMessages.successDeleted);
              this.blogTags = this.blogTags.filter((item) => item.id !== response.id);
            }, (error: HttpErrorResponse) => {
              this.notificationService.warn(generalMessages.serverProblem);
            });
        }
      }
    );
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  get f() {
    return this.blogTagForm.controls;
  }

  isValid() {
    return this.blogTagForm.valid;
  }
}
