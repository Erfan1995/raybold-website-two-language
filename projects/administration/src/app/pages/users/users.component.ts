import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {UsersService} from './users.service';
import {HttpErrorResponse} from '@angular/common/http';
import {generalMessages} from '../../../../../website/src/app/validation/commonErrorMessages';
import {NotificationService} from '../../services/notification.service';
import {UsersType} from './users.type';
import {EditUsersComponent} from './edit-users/edit-users.component';
import {LoaderService} from '../../services/loader.service';
import {DropDownService} from '../../services/drop-down.service';
import {DialogService} from '../../services/dialog.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users;

  constructor(private dialog: MatDialog,
              private userServices: UsersService,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private dropDownService: DropDownService,
              private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.listUsers();
  }

  listUsers() {
    this.userServices.list().subscribe(
      (result: UsersType) => {
        this.users = result;
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
  }

  openEditUserDialog(value) {
    const dialogRef = this.dialog.open(EditUsersComponent, {
      height: '500px',
      width: '500px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'backdropBackground',
      data: {editData: value}
    });
    dialogRef.afterClosed().subscribe((result: UsersType) => {
      if (result) {
        this.users.find(item => {
          if (item.id === result.id) {
            item.full_name = result.full_name;
            item.phone = result.phone;
            item.email = result.email;
            item.status = this.dropDownService.get('userStatus', result.user_status_id).status;
            item.title = this.dropDownService.get('roles', Number(result.privilege_id)).title;
            item.user_status_id = result.user_status_id;
            item.privilege_id = result.privilege_id;
          }
        });
      }
      this.loader.closeLoader();
    });

  }

  deleteUser(value) {
    this.dialogService.openConfirmDialog(generalMessages.confirmMessage)
      .afterClosed().subscribe(res => {
      if (res) {
        this.userServices.delete(value).subscribe(
          (response: any) => {
            this.notificationService.success(generalMessages.successDeleted);
            this.users = this.users.filter((item) => item.id !== response.id);
          }, (error: HttpErrorResponse) => {
            this.notificationService.warn(generalMessages.serverProblem);
          });
      }
    });
  }

}
