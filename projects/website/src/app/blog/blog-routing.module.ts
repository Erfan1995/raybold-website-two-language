import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {BlogComponent} from './blog.component';
import {BlogDetailsComponent} from './blog-details/blog-details.component';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
  },
  {
    path: 'blog-details/:id/:title/:blog_category_id',
    component: BlogDetailsComponent
  },
  {
    path: 'blog/:tagName',
    component: BlogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {

}
