import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {NotificationService} from '../../services/notification.service';
import {LoaderService} from '../../services/loader.service';
import {ProductService} from './product.service';
import {generalMessages, messages} from '../../../../../website/src/app/validation/commonErrorMessages';
import {DialogService} from '../../services/dialog.service';
import {IProduct} from './products.type';





@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public Editor = ClassicEditor;
  productForm: FormGroup;
  productFileForm: FormGroup;
  errorMessages = messages;
  products;
  productsFiles;
  isInsertMode = false;
  isInsertFileMode = false;
  isFileMode = false;
  productId;
  productFile;

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private loader: LoaderService,
              private productService: ProductService,
              private dialogService: DialogService) {

  }

  ngOnInit(): void {
    this.initCreateProductForm();
    // this.listProducts();
  }


  // listProducts() {
  //   this.loader.openLoader();
  //   this.productService.listProducts().subscribe((res) => {
  //     this.loader.closeLoader();
  //     this.products = res;
  //     this.notificationService.success(generalMessages.reachedSuccess);
  //   }, (error) => {
  //     this.loader.closeLoader();
  //     this.notificationService.warn(generalMessages.serverProblem);
  //   });
  // }

  listProductFiles(productId: number) {
    this.productId = productId;
    this.initCreateProductFileForm();
    this.loader.openLoader();
    this.productService.listProductFiles(productId).subscribe((res) => {
      this.loader.closeLoader();
      this.isFileMode = true;
      this.isInsertMode = false;
      this.productsFiles = res;
      this.productsFiles.forEach((item) => {
        item.path = this.productService.filePath(item.path);
      });
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
      content: [null, [
        Validators.required,
        Validators.minLength(3),
      ]],
    });
  }

  initCreateProductFileForm(): void {
    this.productFileForm = this.formBuilder.group({
      file: [null, [
        Validators.required
      ]],
      isMainFile: [null, [
        Validators.required
      ]],
      product_id: [this.productId],
    });
  }

  initUpdateProductForm(data: IProduct): void {
    this.productForm = this.formBuilder.group({
      title: [data && data.title, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      link: [data && data.link, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      content: [data , [
        Validators.required,
        Validators.minLength(3),
      ]],
      id: [data && data.id],
    });
  }

  createAndUpdate(productForm): void {
    if (productForm) {
      this.loader.openLoader();
      if (!productForm.value.id) {
        this.productService.store(productForm.value).subscribe((res) => {
          this.loader.closeLoader();
          this.initCreateProductForm();
          this.notificationService.success(generalMessages.successInserted);
          this.isInsertMode = false;
          this.products.push(res);
          this.products.reverse();
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      } else {
        this.productService.update(productForm.value).subscribe((res) => {
          this.loader.closeLoader();
          this.initCreateProductForm();
          this.notificationService.success(generalMessages.successInserted);
          this.isInsertMode = false;
          this.products.filter((item) => {
            if (item.id === productForm.value.id) {
              item.title = productForm.value.title;
              item.content = productForm.value.content;
              item.link = productForm.value.link;
            }
          });
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      }
    } else {
      this.notificationService.warn(generalMessages.validation);
    }

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

  get pf() {
    return this.productFileForm.controls;
  }

  isValid() {
    return this.productForm.valid;
  }

  isFileValid() {
    return this.productFileForm.valid;
  }

  insertMode() {
    this.isInsertMode = true;
  }

  insertFileMode() {
    this.isInsertFileMode = true;
  }

  fileMode(productId: number) {
    this.listProductFiles(productId);
    this.isFileMode = true;
  }

  updateMode(value: IProduct) {
    this.isInsertMode = true;
    this.initUpdateProductForm(value);
  }

  storeFile(productFileForm) {
    const formData = new FormData();
    if (this.productFile) {
      formData.append('file', this.productFile);
    }
    productFileForm.value.isMainFile === 'true' ? productFileForm.value.isMainFile = true : productFileForm.value.isMainFile = false;
    formData.append('integratedFormData', JSON.stringify(productFileForm.value));
    this.productService.storeFile(formData).subscribe((res) => {
      this.loader.closeLoader();
      this.initCreateProductFileForm();
      this.notificationService.success(generalMessages.successInserted);
      this.isInsertFileMode = false;
      res.path = this.productService.filePath(res.path);
      this.productsFiles.push(res);
      this.productsFiles.reverse();
    }, (error) => {
      this.loader.closeLoader();
      this.notificationService.warn(generalMessages.serverProblem);
    });


  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.productFile = event.target.files[0];
    }
  }

  deleteProductFile(id: number) {
    this.dialogService.openConfirmDialog(generalMessages.doUWantDelete).afterClosed().subscribe(res => {
      if (res) {
        this.productService.deleteFile(id).subscribe((item) => {
          this.loader.closeLoader();
          this.notificationService.success(generalMessages.successInserted);
          this.productsFiles = this.productsFiles.filter((pro) => {
            return pro.id !== id;
          });
        }, (error) => {
          this.loader.closeLoader();
          this.notificationService.warn(generalMessages.serverProblem);
        });
      }
    });
  }

  back() {
    this.isFileMode = false;
    this.isInsertFileMode = false;
  }

}
