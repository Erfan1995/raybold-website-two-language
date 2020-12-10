import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ServicesRoutingModule} from './services-routing.module';
import {ServicesComponent} from './services.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ViewServicesComponent} from './view-services/view-services.component';
import {AddServicesComponent} from './add-services/add-services.component';
import {AddServiceContentComponent} from './add-service-content/add-service-content.component';
import {ShowServiceDetailsComponent} from './show-service-details/show-service-details.component';
import {ReactiveFormsModule} from '@angular/forms';
import {EditServiceInfoDialogComponent} from './edit-service-info-dialog/edit-service-info-dialog.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [ServicesComponent, ViewServicesComponent, AddServicesComponent,
    AddServiceContentComponent, ShowServiceDetailsComponent, EditServiceInfoDialogComponent],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    CKEditorModule,
    SharedModule,

  ]
})
export class ServicesModule {
}
