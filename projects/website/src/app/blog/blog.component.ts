import {Component, OnInit} from '@angular/core';
import {BlogService} from './blog.service';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  offSet = 0;
  blogInfoList;
  blogList = [];
  blogSearchForm: FormGroup;
  searchMode = false;
  showButton = false;
  tagName;

  constructor(private blogService: BlogService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.initBlogSearch();
    this.searchMode = false;
    this.activatedRoute.queryParams.subscribe(params => {
      this.tagName = params.blogTag;
      this.listBlog(this.offSet);
    });
    if (this.tagName) {
      this.searchBlog({tag_name: this.tagName});
    }
  }

  initBlogSearch() {
    this.blogSearchForm = this.formBuilder.group({
      tag_name: ['', []]
    });
  }

  listBlog(blogItemNumber) {
    this.blogService.listBlog(blogItemNumber).subscribe(
      (result) => {
        this.blogInfoList = result;
        if (this.searchMode === false) {
          this.showButton = true;
          for (const blog of this.blogInfoList) {
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
              path: this.blogService.blogFilePath(blog.path),
              subtitle: blog.subtitle
            });
          }
        } else {

          this.blogList = this.blogInfoList;
          this.blogList.forEach((item) => {
            item.path = this.blogService.blogFilePath(item.path);
          });
        }

      }, (error: HttpErrorResponse) => {

      });
  }

  viewMoreBlog() {
    this.searchMode = false;
    this.offSet += this.blogInfoList.length;
    this.listBlog(this.offSet);

  }

  searchBlog(value) {
    if (value.tag_name) {
      this.blogService.listSearchedBlog(value).subscribe(
        (result) => {
          this.blogList = result;
          this.blogList.forEach((item) => {
            item.path = this.blogService.blogFilePath(item.path);
          });
          this.searchMode = true;
          this.showButton = false;
          this.initBlogSearch();
        }
      );
    } else {
      this.searchMode = true;
      this.offSet = 0;
      this.showButton = true;
      this.listBlog(this.offSet);
    }

  }


}
