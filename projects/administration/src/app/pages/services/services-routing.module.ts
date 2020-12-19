import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ServicesComponent} from './services.component';
import {AddServicesComponent} from './add-services/add-services.component';
import {ViewServicesComponent} from './view-services/view-services.component';
import {AddServiceContentComponent} from './add-service-content/add-service-content.component';


const routes: Routes = [
  {
    path: '',
    component: ServicesComponent,
  },
  {
    path: 'add-service',
    component: AddServicesComponent
  },
  {
    path: 'view-service',
    component: ViewServicesComponent
  },
  {
    path: 'add-service-content/:id/:title/:language',
    component: AddServiceContentComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule {
}
