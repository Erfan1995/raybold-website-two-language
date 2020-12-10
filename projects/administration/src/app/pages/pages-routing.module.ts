import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PagesComponent} from './pages.component';
import {PartnersComponent} from './partners/partners.component';
import {CustomersComponent} from './customers/customers.component';
import {ProductsComponent} from './products/products.component';
import {ProjectsComponent} from './projects/projects.component';
import {UsersComponent} from './users/users.component';
import {AboutUsComponent} from './about-us/about-us.component';
import {ContactsUsComponent} from './contacts-us/contacts-us.component';
import {AdminBloggerAuthGuardService} from '../services/adminBlogger-auth-guard.service';
import {AdminAuthGuard} from '../services/admin-auth-guard.service';
import {NoAccessComponent} from './no-access/no-access.component';


const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'blog',
        loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
        canActivate: [AdminBloggerAuthGuardService]
      },
      {
        path: 'services',
        loadChildren: () => import('./services/services.module').then(m => m.ServicesModule),
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'partners',
        component: PartnersComponent,
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'customers',
        component: CustomersComponent,
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'about-us',
        component: AboutUsComponent,
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'contact-us',
        component: ContactsUsComponent,
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'no-access',
        component: NoAccessComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
