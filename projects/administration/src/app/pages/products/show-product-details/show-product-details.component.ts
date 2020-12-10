import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css']
})
export class ShowProductDetailsComponent implements OnInit {
  products;

  constructor(public dialogRef: MatDialogRef<ShowProductDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data,) {
  }

  ngOnInit(): void {
    this.products = this.data.productData;
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}
