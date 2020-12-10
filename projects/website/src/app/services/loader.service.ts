import {Injectable} from '@angular/core';
import {LoadingComponent} from '../shared/loading/loading.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    constructor(private matDialog: MatDialog) {
    }

    openLoader() {
        return this.matDialog.open(LoadingComponent, {
            width: '100px',
            height: '100px',

            panelClass: 'loader-dialog-container',
            disableClose: true,

        });
    }

    closeLoader() {
       this.matDialog.closeAll();
    }
}
