import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ServiceComponent} from './service.component';
import {ServicesDetailsComponent} from './services-details/services-details.component';
import {ServicesRoutingModule} from './services-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [ServiceComponent, ServicesDetailsComponent],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    MatDialogModule,
    SharedModule,
    ReactiveFormsModule,
    LazyLoadImageModule
  ]
})
export class ServiceModule {
}
