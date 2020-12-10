import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DropDownService} from '../../../services/drop-down.service';
import {generalMessages, messages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {BlogService} from '../blog.service';
import {LoaderService} from '../../../services/loader.service';
import {NotificationService} from '../../../services/notification.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-change-blog-status-dialog',
  templateUrl: './change-blog-status-dialog.component.html',
  styleUrls: ['./change-blog-status-dialog.component.css']
})
export class ChangeBlogStatusDialogComponent implements OnInit {
  blogStatusForm: FormGroup;
  errorMessages = messages;
  blogStatus;

  constructor(public dialogRef: MatDialogRef<ChangeBlogStatusDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private formBuilder: FormBuilder,
              private dropDownService: DropDownService,
              private blogService: BlogService,
              private loader: LoaderService,
              private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.blogStatus = this.dropDownService.getAll('blogStatus');
    this.initUpdateBlogStatus();
  }

  initUpdateBlogStatus() {
    this.blogStatusForm = this.formBuilder.group({
      blog_status_id: [this.data.blogData.blog_status_id,
        Validators.required
      ],
      id: this.data.blogData.id
    });
  }

  updateBlogStatus(value) {
    this.blogService.updateBlogStatus(value).subscribe(
      (result) => {
        this.closeDialog({
          id: this.data.blogData.id,
          blog_status_id: result.blog_status_id
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
    return this.blogStatusForm.controls;
  }

  isValid() {
    return this.blogStatusForm.valid;
  }

}
