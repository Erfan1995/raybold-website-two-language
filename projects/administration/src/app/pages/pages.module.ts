import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesComponent} from './pages.component';
import {HeaderComponent} from './layout/header/header.component';
import {SidebarComponent} from './layout/sidebar/sidebar.component';
import {PagesRoutingModule} from './pages-routing.module';
import {UsersComponent} from './users/users.component';
import {AboutUsComponent} from './about-us/about-us.component';
import {CustomersComponent} from './customers/customers.component';
import {ProductsComponent} from './products/products.component';
import {PartnersComponent} from './partners/partners.component';
import {ProjectsComponent} from './projects/projects.component';
import {ContactsUsComponent} from './contacts-us/contacts-us.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {EditUsersComponent} from './users/edit-users/edit-users.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {SharedModule} from '../shared/shared.module';
import {NoAccessComponent} from './no-access/no-access.component';


@NgModule({
  declarations: [PagesComponent, HeaderComponent,
    SidebarComponent, UsersComponent, AboutUsComponent, CustomersComponent,
    PartnersComponent, ProjectsComponent, ContactsUsComponent, EditUsersComponent, NoAccessComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    CKEditorModule,
    SharedModule,
  ],
  entryComponents: []
})
export class PagesModule {
}
