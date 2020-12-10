import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './layout/header/header.component';
import {FooterComponent} from './layout/footer/footer.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {HttpService} from './services/http.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './home/home.component';
import {AboutUsComponent} from './about-us/about-us.component';
import {ContactUsComponent} from './contact-us/contact-us.component';
import {CustomersComponent} from './customers/customers.component';
import {PartnersComponent} from './partners/partners.component';
import {SharedModule} from './shared/shared.module';
import {DynamicScriptLoaderService} from './services/DynamicScriptLoaderService';
import {ProjectsComponent} from './projects/projects.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { FacebookModule } from 'ngx-facebook';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutUsComponent,
    ContactUsComponent,
    CustomersComponent,
    PartnersComponent,
    HeaderComponent,
    FooterComponent,
    ProjectsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    HttpClientModule,
    CommonModule,
    SharedModule,
    MatSnackBarModule,
    NoopAnimationsModule,
    CKEditorModule,
    LazyLoadImageModule,
    HttpClientModule,
    FacebookModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [HttpService, DynamicScriptLoaderService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
