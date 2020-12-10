import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BlogRoutingModule} from './blog-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import { AddBlogComponent } from './add-blog/add-blog.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import { ViewBlogComponent } from './view-blog/view-blog.component';
import { AddBlogContentComponent } from './add-blog-content/add-blog-content.component';
import { ViewBlogDetailsComponent } from './view-blog-details/view-blog-details.component';
import {ReactiveFormsModule} from '@angular/forms';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
import {SharedModule} from '../../shared/shared.module';
import { ChangeBlogStatusDialogComponent } from './change-blog-status-dialog/change-blog-status-dialog.component';
import { BlogTagsDialogComponent } from './blog-tags-dialog/blog-tags-dialog.component';


@NgModule({
  declarations: [ AddBlogComponent, ViewBlogComponent,
    AddBlogContentComponent, ViewBlogDetailsComponent, EditBlogComponent, ChangeBlogStatusDialogComponent, BlogTagsDialogComponent],
  imports: [
    CommonModule,
    BlogRoutingModule,
    MatDialogModule,
    CKEditorModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class BlogModule { }
