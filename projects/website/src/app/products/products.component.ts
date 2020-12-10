import {Component, OnInit} from '@angular/core';
import {ProductsServices} from './products.services';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products;

  constructor(private productService: ProductsServices) {
  }

  ngOnInit(): void {
    this.productService.listAllProducts().subscribe(
      (result) => {
        this.products = result;
        this.products.forEach((item) => {
          item.path = this.productService.FilePath(item.path);
        });
      }
    );
  }

}
