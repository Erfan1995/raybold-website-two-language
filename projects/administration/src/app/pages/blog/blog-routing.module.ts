import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ViewBlogComponent} from './view-blog/view-blog.component';
import {AddBlogComponent} from './add-blog/add-blog.component';
import {AddBlogContentComponent} from './add-blog-content/add-blog-content.component';
import {AdminBloggerAuthGuardService} from '../../services/adminBlogger-auth-guard.service';
import {AdminAuthGuard} from '../../services/admin-auth-guard.service';
import {NoAccessComponent} from '../no-access/no-access.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'view-blog',
    pathMatch: 'full'
  },
  {
    path: 'view-blog',
    component: ViewBlogComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'add-blog',
    component: AddBlogComponent,
    canActivate: [AdminBloggerAuthGuardService]
  },
  {
    path: 'blog-content/:id/:title',
    component: AddBlogContentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {
}
