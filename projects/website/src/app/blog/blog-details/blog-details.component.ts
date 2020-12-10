import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BlogService} from '../blog.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {
  blogId;
  blogName;
  blogCategoryId;
  blogDetails;
  blogList;
  blogTags;
  commentsForm: FormGroup;
  comments;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private blogService: BlogService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.blogId = Number(this.activatedRoute.snapshot.params.id);
    this.blogName = this.activatedRoute.snapshot.params.title;
    this.blogCategoryId = this.activatedRoute.snapshot.params.blog_category_id;
    this.getBlogDetails();
    this.getBlogList();
    this.initCommentsForm();
    this.listBlogComments();
  }

  initCommentsForm() {
    this.commentsForm = this.formBuilder.group({
      comment: ['', []],
      full_name: ['', []],
      email: ['', []],
      blog_id: [this.blogId]
    });
  }

  getBlogDetails(blogId = null, blogName = null) {
    if (blogId) {
      this.blogId = blogId;
      this.blogName = blogName;
    }
    this.blogService.getBlogDetails(this.blogId).subscribe(
      (result) => {
        this.blogDetails = result.content;
        this.blogTags = result.tags;
        this.blogDetails.forEach((item) => {
          if (item.image_path !== null) {
            item.image_path = this.blogService.blogFilePath(item.image_path);
          }
        });
        console.log(this.blogDetails);
      }
    );


  }

  getBlogList() {
    this.blogService.listRelatedBlog(this.blogCategoryId).subscribe(
      (result) => {
        this.blogList = result;
        this.blogList.forEach((item) => {
          if (item.path !== null) {
            item.path = this.blogService.blogFilePath(item.path);
          }
        });
      }
    );
  }

  listBlogComments() {
    this.blogService.listBlogComment(this.blogId).subscribe(
      result => {
        if (result) {
          this.comments = result;
        }
      }
    );
  }

  sendComments(value) {
    if (value.name !== '' && value.email !== '' && value.comment !== '') {
      if (value.full_name.length < 30 && value.email.length < 35) {
        this.blogService.storeBlogComments(value).subscribe(
          result => {
            if (result) {
              this.comments.reverse();
              this.comments.push(result);
              this.comments.reverse();
              this.initCommentsForm();
            }
          }
        );
      }
    }
  }

  navigateToBlog(tagName) {
    this.router.navigate(['blog'], {queryParams: {blogTag: tagName}});
  }

}
