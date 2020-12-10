import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AddProductsComponent} from './add-products/add-products.component';
import {ViewProductsComponent} from './view-products/view-products.component';
import {AddProductContentComponent} from './add-product-content/add-product-content.component';


const routes: Routes = [
  {
    path: '',
    component: AddProductsComponent,
  },
  {
    path: 'add-products',
    component: AddProductsComponent
  },
  {
    path: 'view-products',
    component: ViewProductsComponent
  },
  {
    path: 'add-product-content/:id/:title',
    component: AddProductContentComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductsRoutingModule {

}
