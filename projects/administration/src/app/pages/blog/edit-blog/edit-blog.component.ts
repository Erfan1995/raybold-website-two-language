import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {generalMessages, messages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DropDownService} from '../../../services/drop-down.service';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {BlogService} from '../blog.service';
import {BlogInfoType} from '../blog.type';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  errorMessages = messages;
  blogCategory;
  updateBlogInfoForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<EditBlogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private dropDownServices: DropDownService,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private blogService: BlogService,
  ) {
  }

  ngOnInit(): void {
    this.blogCategory = this.dropDownServices.getAll('blogCategory');
    this.initUpdateBlogInfo(this.data.editData);
  }

  initUpdateBlogInfo(data) {
    this.updateBlogInfoForm = this.formBuilder.group({
      title: [data.title,
        [
          Validators.required
        ]
      ],
      blog_category_id: [data.blog_category_id,
        [
          Validators.required
        ]
      ],
      language: [data.language,
        [
          Validators.required
        ]
      ],
      blog_resource: [data.blog_resource,
        []
      ],
      id: data.id
    });
  }

  editBlogInfo(value) {
    this.blogService.editBlogInfo(value).subscribe(
      (result: BlogInfoType) => {
        this.closeDialog({
          id: this.data.editData.id,
          title: result.title,
          blog_category_id: result.blog_category_id,
          blog_resource: result.blog_resource,
          language: result.language,
          blog_status_id: this.data.editData.blog_status_id,
          user_id: this.data.editData.user_id
        });
        this.notificationService.success(generalMessages.successUpdated);

      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });

  }

  closeDialog(result = null) {
    if (result) {
      this.dialogRef.close(result);
    } else {
      this.dialogRef.close(null);
    }
  }

  get f() {
    return this.updateBlogInfoForm.controls;
  }

  isValid() {
    return this.updateBlogInfoForm.valid;
  }
}
