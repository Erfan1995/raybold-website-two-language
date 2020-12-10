import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {HttpService} from './services/http.service';
import {CommonModule} from '@angular/common';
import {SharedModule} from './shared/shared.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule


  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
