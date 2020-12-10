import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {generalMessages, messages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogService} from '../../../services/dialog.service';
import {ProductService} from '../product.service';
import {EditProductsInfoComponent} from '../edit-products-info/edit-products-info.component';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent implements OnInit {
  productForm: FormGroup;
  errorMessages = messages;
  products;

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private productService: ProductService,
              private dialog: MatDialog,
              private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.listProducts();
    this.initCreateProductForm();
  }

  listProducts() {
    this.loader.openLoader();
    this.productService.listProducts().subscribe((res) => {
      this.loader.closeLoader();
      this.products = res;
      this.notificationService.success(generalMessages.reachedSuccess);
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });
  }

  initCreateProductForm(): void {
    this.productForm = this.formBuilder.group({
      title: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      link: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
    });
  }

  addProduct(value): void {
    this.loader.openLoader();
    this.productService.store(value).subscribe((res) => {
      this.loader.closeLoader();
      this.initCreateProductForm();
      this.notificationService.success(generalMessages.successInserted);
      this.products.push(res);
      this.products.reverse();
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });
  }

  editProductInfo(product) {
    const dialogRef = this.dialog.open(EditProductsInfoComponent, {
      height: '400px',
      width: '400px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'backdropBackground',
      data: {editData: product}
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.products.find(item => {
            if (result.id === item.id) {
              item.title = result.title;
              item.link = result.link;
            }
          });
        }
      }
    );
  }

  deleteProduct(id: number) {
    this.dialogService.openConfirmDialog(generalMessages.doUWantDelete).afterClosed().subscribe(res => {
      if (res) {
        this.productService.delete(id).subscribe((item) => {
          this.loader.closeLoader();
          this.notificationService.success(generalMessages.successInserted);
          this.products = this.products.filter((pro) => {
            return pro.id !== id;
          });
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      }
    });
  }

  get f() {
    return this.productForm.controls;
  }

  isValid() {
    return this.productForm.valid;
  }

  reset() {
    this.productForm.reset();
  }
}
