import {RouterModule, Routes} from '@angular/router';
import {ProductsComponent} from './products.component';
import {ProductsDetailsComponent} from './products-details/products-details.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: 'products-details/:id/:title',
    component: ProductsDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {

}
