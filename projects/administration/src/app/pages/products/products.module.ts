import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {SharedModule} from '../../shared/shared.module';
import {AddProductsComponent} from './add-products/add-products.component';
import {AddProductContentComponent} from './add-product-content/add-product-content.component';
import {ShowProductDetailsComponent} from './show-product-details/show-product-details.component';
import {ViewProductsComponent} from './view-products/view-products.component';
import {ProductsRoutingModule} from './products-routing.module';
import {ProductsComponent} from './products.component';
import { EditProductsInfoComponent } from './edit-products-info/edit-products-info.component';

@NgModule({
  declarations: [AddProductsComponent, AddProductContentComponent, ShowProductDetailsComponent, ViewProductsComponent, ProductsComponent, EditProductsInfoComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    CKEditorModule,
    SharedModule,

  ]
})
export class ProductsModule {

}
