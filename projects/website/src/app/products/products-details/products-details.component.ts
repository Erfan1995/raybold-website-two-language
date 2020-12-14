import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductsServices} from '../products.services';
import {Meta, Title} from '@angular/platform-browser';
import {SetSocialMediaTagsService} from '../../services/set-social-media-tags.service';

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.css']
})
export class ProductsDetailsComponent implements OnInit {
  productId;
  productTitle;
  productContent;
  productList;
  url;

  constructor(private activatedRoute: ActivatedRoute,
              private productService: ProductsServices,
              private setMetaData: SetSocialMediaTagsService
              // private title: Title,
              // private meta: Meta
  ) {


  }

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params.id;
    this.productTitle = this.activatedRoute.snapshot.params.title;
    this.getProductDetails();
    this.getProductList();
    this.url = window.location.href;
    this.setMetaData.setFacebookTags(
      this.url,
      this.productTitle,
      ' this is some text herethis is some text herethis is some text herethis is some text herethis is some text herethis is some text herethis is some text here ',
      'https://backend.raybold.co/public/api/products/productFiles/2020-12-01-06-26-34am662.jpg');
  }

  getProductDetails(productId = null, productName = null) {
    if (productId) {
      this.productId = productId;
      this.productTitle = productName;
    }
    this.productService.getProductContent(this.productId).subscribe(
      result => {
        this.productContent = result;
        this.productContent.forEach((item) => {
          if (item.file_path !== null) {
            item.file_path = this.productService.FilePath(item.file_path);
          }
        });
        this.productContent.reverse();
      }
    );
  }

  getProductList() {
    this.productService.listProducts().subscribe(
      (result) => {
        this.productList = result;
        this.productList.forEach((item) => {
          if (item.path !== null) {
            item.path = this.productService.FilePath(item.path);
          }
        });
      }
    );
  }
}
