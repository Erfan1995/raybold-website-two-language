import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BlogService} from '../blog.service';
import {environment as localEnvironment} from '../../../../environments/environment';
import {environment as productionEnvironment} from '../../../../environments/environment.prod';
import {DropDownService} from '../../../services/drop-down.service';

@Component({
  selector: 'app-view-blog-details',
  templateUrl: './view-blog-details.component.html',
  styleUrls: ['./view-blog-details.component.css']
})
export class ViewBlogDetailsComponent implements OnInit {
  blog;
  env = localEnvironment || productionEnvironment;
  blogData;

  constructor(public dialogRef: MatDialogRef<ViewBlogDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private blogService: BlogService,
              public dropDownService: DropDownService
  ) {
  }

  ngOnInit(): void {
    this.blogData = this.data.blogData;
    this.blogService.listBlogContent(this.blogData.id).subscribe(
      (result) => {
        this.blog = result;
        this.blog.forEach((item) => {
          if (item.image_path !== null) {
            item.image_path = this.env.baseUrl.backend.main + this.blogService.filePath(item.image_path);
          }
        });
      }
    );
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}
