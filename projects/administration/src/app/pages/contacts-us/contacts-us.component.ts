import {Component, OnInit} from '@angular/core';
import {generalMessages} from '../../../../../website/src/app/validation/commonErrorMessages';
import {NotificationService} from '../../services/notification.service';
import {LoaderService} from '../../services/loader.service';
import {MatDialog} from '@angular/material/dialog';
import {ContactUsService} from './contact-us.service';
import {ShowProductDetailsComponent} from '../products/show-product-details/show-product-details.component';
import {ContactUsDetailsDialogComponent} from './contact-us-details-dialog/contact-us-details-dialog.component';

@Component({
  selector: 'app-contacts-us',
  templateUrl: './contacts-us.component.html',
  styleUrls: ['./contacts-us.component.css']
})
export class ContactsUsComponent implements OnInit {
  contactUsInfo;

  constructor(private notificationService: NotificationService,
              private loader: LoaderService,
              private dialog: MatDialog,
              private contactUs: ContactUsService
  ) {
  }

  ngOnInit(): void {
    this.listContactUs();
  }

  listContactUs() {
    this.loader.openLoader();
    this.contactUs.listContactUs().subscribe((res) => {
      this.loader.closeLoader();
      this.contactUsInfo = res;
      this.notificationService.success(generalMessages.reachedSuccess);
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });
  }

  contentDetails(content) {
    const dialogRef = this.dialog.open(ContactUsDetailsDialogComponent, {
      height: '500px',
      width: '600px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'backdropBackground',
      data: {contact: content}
    });
  }
}
