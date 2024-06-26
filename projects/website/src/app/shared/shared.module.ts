import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingComponent} from './loading/loading.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {SanitizeHtmlPipe} from './pipe/sanitize-html.pipe';
import {FormatStringPipe} from './pipe/format-string.pipe';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {FormatTimePipe} from './pipe/format-time.pipe';
import { LanguagePipe } from './pipe/language.pipe';
import { FbLikeShareComponent } from './fb-like-share/fb-like-share.component';

@NgModule({
  declarations: [
    LoadingComponent,
    SanitizeHtmlPipe,
    FormatStringPipe,
    ConfirmationDialogComponent,
    FormatTimePipe,
    LanguagePipe,
    FbLikeShareComponent,
  ],
  entryComponents: [
    LoadingComponent,
    ConfirmationDialogComponent
  ],
  exports: [
    SanitizeHtmlPipe,
    FormatStringPipe,
    FormatTimePipe,
    LanguagePipe,
    FbLikeShareComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ]
})
export class SharedModule {
}
