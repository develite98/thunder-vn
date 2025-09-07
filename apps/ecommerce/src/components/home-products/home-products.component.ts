import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EMixContentStatus, MixQuery } from '@mixcore/sdk-client';
import { publicCategoryStore } from '../../stores/public-category.store';
import { publicProductStore } from '../../stores/public-product.store';
import { ProductByCategoryComponent } from '../product-by-category/product-by-category.component';

@Component({
  selector: 'mix-home-products',
  imports: [ProductByCategoryComponent, RouterLink],
  templateUrl: './home-products.component.html',
  styleUrl: './home-products.component.scss',
})
export class HomeProductsComponent {
  public store = inject(publicCategoryStore);
  public productStore = inject(publicProductStore);

  constructor() {
    this.store
      .search(
        new MixQuery().default(20).equal('status', EMixContentStatus.Published),
      )
      .subscribe();

    this.productStore
      .search(
        new MixQuery()
          .default(100)
          .equal('status', EMixContentStatus.Published),
      )
      .subscribe();
  }
}
