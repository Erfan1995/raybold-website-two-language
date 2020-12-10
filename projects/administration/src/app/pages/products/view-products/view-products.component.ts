import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {DropDownService} from '../../../services/drop-down.service';
import {ServicesService} from '../../services/services.service';
import {DialogService} from '../../../services/dialog.service';
import {ProductService} from '../product.service';
import {HttpErrorResponse} from '@angular/common/http';
import {generalMessages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {ShowServiceDetailsComponent} from '../../services/show-service-details/show-service-details.component';
import {ShowProductDetailsComponent} from '../show-product-details/show-product-details.component';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit {
  productList;

  constructor(private dialog: MatDialog,
              private notificationService: NotificationService,
              private loader: LoaderService,
              public dropdownServices: DropDownService,
              private productService: ProductService,
              private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.listAllServices();
  }

  listAllServices() {
    this.productService.listAllProducts().subscribe(
      (result) => {
        this.productList = result;
        for (const product of this.productList) {
          for (const productDetails of product.product_details) {
            if (productDetails.file_path !== null) {
              productDetails.file_path = this.productService.filePath(productDetails.file_path);
            }
          }
        }
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });
  }

  openServiceDetailsDialog(product) {
    const dialogRef = this.dialog.open(ShowProductDetailsComponent, {
      height: '700px',
      width: '800px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'backdropBackground',
      data: {productData: product}
    });
  }

  deleteProduct(id: number) {
    this.dialogService.openConfirmDialog(generalMessages.doUWantDelete).afterClosed().subscribe(res => {
      if (res) {
        this.productService.delete(id).subscribe((item) => {
          this.loader.closeLoader();
          this.notificationService.success(generalMessages.successInserted);
          this.productList = this.productList.filter((pro) => {
            return pro.product_id !== id;
          });
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      }
    });
  }
}
