import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlogComponent} from './blog.component';
import {BlogDetailsComponent} from './blog-details/blog-details.component';
import {BlogRoutingModule} from './blog-routing.module';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {LazyLoadImageModule} from 'ng-lazyload-image';


@NgModule({
  declarations: [BlogComponent, BlogDetailsComponent],
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    LazyLoadImageModule
  ]
})
export class BlogModule {
}
