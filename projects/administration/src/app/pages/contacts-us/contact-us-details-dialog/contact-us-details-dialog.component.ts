import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-contact-us-details-dialog',
  templateUrl: './contact-us-details-dialog.component.html',
  styleUrls: ['./contact-us-details-dialog.component.css']
})
export class ContactUsDetailsDialogComponent implements OnInit {
  contactInfo;

  constructor(public dialogRef: MatDialogRef<ContactUsDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit(): void {
    this.contactInfo = this.data.contact;
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}
