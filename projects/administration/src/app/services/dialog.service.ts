import {Injectable} from '@angular/core';
import {ConfirmationDialogComponent} from '../shared/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private matDialog: MatDialog) {
  }

  openConfirmDialog(msg) {
    return this.matDialog.open(ConfirmationDialogComponent, {
      width: '390px',
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: {
        message: msg
      }
    });
  }
}
