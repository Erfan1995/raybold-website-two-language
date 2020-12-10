import {Component, Inject, OnInit} from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {generalMessages, messages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UsersService} from '../users.service';
import {DropDownService} from '../../../services/drop-down.service';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent implements OnInit {
  public Editor = ClassicEditor;
  roles;
  userStatus;
  userUpdateFrom: FormGroup;
  errorMessages = messages;
  userId;

  constructor(public dialogRef: MatDialogRef<EditUsersComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private formBuilder: FormBuilder,
              private userServices: UsersService,
              private dropDownService: DropDownService,
              private notificationServices: NotificationService,
              private loader: LoaderService,
  ) {
  }

  ngOnInit(): void {
    this.userId = this.data.editData.id;
    this.roles = this.dropDownService.getAll('roles');
    this.userStatus = this.dropDownService.getAll('userStatus');
    this.initUpdateUsers(this.data.editData);
  }

  initUpdateUsers(data) {
    this.userUpdateFrom = this.formBuilder.group({
      full_name: [data && data.full_name,
        [
          Validators.required,
          Validators.maxLength(62),
          Validators.minLength(3)
        ]
      ],
      phone: [data && data.phone,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
          Validators.minLength(10)
        ]
      ],
      email: [data && data.email,
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(62),
          Validators.minLength(3)
        ]
      ],
      user_status_id: [data && data.user_status_id,
        [
          Validators.required,
        ]
      ],
      privilege_id: [data && data.privilege_id,
        [
          Validators.required
        ]
      ],
      user_id: this.userId,
    });
  }

  updateUser(value) {

    this.loader.openLoader();
    this.userServices.update(value).subscribe(
      (result) => {
        console.log(result);
        this.closeDialog({
          id: this.userId,
          full_name: result.full_name,
          phone: result.phone,
          email: result.email,
          user_status_id: result.user_status_id,
          privilege_id: result.privilege_id
        });
        this.notificationServices.success(generalMessages.successUpdated);
        this.loader.closeLoader();
      }, (error: HttpErrorResponse) => {
        this.notificationServices.warn(generalMessages.serverProblem);
        this.loader.closeLoader();
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
    return this.userUpdateFrom.controls;
  }

  isValid() {
    return this.userUpdateFrom.valid;
  }

}
