import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ServiceComponent} from './service.component';
import {ServicesDetailsComponent} from './services-details/services-details.component';


const routes: Routes = [
  {
    path: '',
    component: ServiceComponent,
  },

  {
    path: 'services-details/:id/:title/:serviceCategoryId',
    component: ServicesDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule {
}
