import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductsComponent} from './products.component';
import {ProductsDetailsComponent} from './products-details/products-details.component';
import {ProductsRoutingModule} from './products-routing.module';
import {SharedModule} from '../shared/shared.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {SetSocialMediaTagsService} from '../services/set-social-media-tags.service';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [ProductsComponent, ProductsDetailsComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    LazyLoadImageModule,
    TranslateModule
  ],
  providers: [
    SetSocialMediaTagsService
  ]
})
export class ProductsModule {
}
