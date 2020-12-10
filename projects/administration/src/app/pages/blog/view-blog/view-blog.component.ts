import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ViewBlogDetailsComponent} from '../view-blog-details/view-blog-details.component';
import {NotificationService} from '../../../services/notification.service';
import {LoaderService} from '../../../services/loader.service';
import {DropDownService} from '../../../services/drop-down.service';
import {BlogService} from '../blog.service';
import {HttpErrorResponse} from '@angular/common/http';
import {generalMessages} from '../../../../../../website/src/app/validation/commonErrorMessages';
import {environment as localEnvironment} from '../../../../environments/environment';
import {environment as productionEnvironment} from '../../../../environments/environment.prod';
import {ChangeBlogStatusDialogComponent} from '../change-blog-status-dialog/change-blog-status-dialog.component';
import {DialogService} from '../../../services/dialog.service';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.css']
})
export class ViewBlogComponent implements OnInit {
  users;
  allBlog;
  blogList = [];
  env = localEnvironment || productionEnvironment;
  offSet = 0;

  constructor(private dialog: MatDialog,
              private notificationService: NotificationService,
              private loader: LoaderService,
              public dropdownServices: DropDownService,
              private blogService: BlogService,
              private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.users = this.dropdownServices.getAll('users');
    this.listAllBlog(this.offSet);
  }

  listAllBlog(blogItemNumber) {
    this.blogService.listAllBlog(blogItemNumber).subscribe(
      (result) => {
        this.allBlog = result;
        console.log(this.allBlog);
        for (const blog of this.allBlog) {
          this.blogList.push({
            blog_category_id: blog.blog_category_id,
            blog_resource: blog.blog_resource,
            blog_status_id: blog.blog_status_id,
            created_at: blog.created_at,
            id: blog.id,
            title: blog.title,
            user_id: blog.user_id,
            full_name: blog.full_name,
            content: blog.content,
            is_main_file: blog.is_main_file,
            path: this.env.baseUrl.backend.main + this.blogService.filePath(blog.path),
            subtitle: blog.subtitle,
            status: blog.status
          });
        }
        this.notificationService.success(generalMessages.reachedSuccess);
      }, (error: HttpErrorResponse) => {
        this.notificationService.warn(generalMessages.serverProblem);
      });

  }

  viewMoreBlog() {
    this.offSet += this.allBlog.length;
    this.listAllBlog(this.offSet);

  }

  openBlogDetailsDialog(blog) {
    const dialogRef = this.dialog.open(ViewBlogDetailsComponent, {
      height: '700px',
      width: '800px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'backdropBackground',
      data: {blogData: blog}
    });
  }

  deleteBlog(blog) {
    // blog.id = blog.id;
    this.dialogService.openConfirmDialog(generalMessages.confirmMessage)
      .afterClosed().subscribe(
      res => {
        if (res) {
          this.blogService.deleteBlogInfo(blog).subscribe(
            response => {
              this.notificationService.success(generalMessages.successDeleted);
              this.blogList = this.blogList.filter((item) => item.id !== response.id);
            }, (error: HttpErrorResponse) => {
              this.notificationService.warn(generalMessages.serverProblem);
            });
        }
      }
    );
  }

  openChangeBlogStatusDialog(blog) {
    const dialogRef = this.dialog.open(ChangeBlogStatusDialogComponent, {
      height: '400px',
      width: '400px',
      panelClass: 'custom-dialog-container',
      backdropClass: 'backdropBackground',
      data: {blogData: blog}
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.blogList.find(item => {
            if (result.id === item.id) {
              item.blog_status_id = result.blog_status_id;
            }
          });
        }
      }
    );
  }
}
