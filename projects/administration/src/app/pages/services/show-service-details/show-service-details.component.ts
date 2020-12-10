import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-show-service-details',
  templateUrl: './show-service-details.component.html',
  styleUrls: ['./show-service-details.component.css']
})
export class ShowServiceDetailsComponent implements OnInit {
  services;

  constructor(public dialogRef: MatDialogRef<ShowServiceDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
  ) {
  }

  ngOnInit(): void {
    this.services = this.data.serviceData;
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}
