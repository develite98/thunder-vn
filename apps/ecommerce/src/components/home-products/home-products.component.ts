import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EMixContentStatus, MixQuery } from '@mixcore/sdk-client';
import { categoryProductStore } from '../../stores';
import { publicCategoryStore } from '../../stores/public-category.store';
import { ProductByCategoryComponent } from '../product-by-category/product-by-category.component';

@Component({
  selector: 'mix-home-products',
  imports: [ProductByCategoryComponent, RouterLink],
  templateUrl: './home-products.component.html',
  styleUrl: './home-products.component.scss',
})
export class HomeProductsComponent {
  public store = inject(publicCategoryStore);
  public categoryProductStore = inject(categoryProductStore);

  constructor() {
    this.store
      .search(
        new MixQuery()
          .default(20)
          .select('id', 'title')
          .equal('status', EMixContentStatus.Published),
      )
      .subscribe({
        next: (res) => {
          if (res && res.items?.length) {
            const catIds = res.items.map((i) => i.id).join(', ');
            this.categoryProductStore
              .search(
                new MixQuery()
                  .default(res.items.length * 4)
                  .inRange('category_id', catIds),
              )
              .subscribe();
          }
        },
      });
  }
}
