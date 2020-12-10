import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductsServices} from '../products.services';

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

  constructor(private activatedRoute: ActivatedRoute,
              private productService: ProductsServices) {
  }

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params.id;
    this.productTitle = this.activatedRoute.snapshot.params.title;
    this.getProductDetails();
    this.getProductList();
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
