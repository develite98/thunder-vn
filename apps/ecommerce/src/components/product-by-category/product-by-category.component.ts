import { SlicePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@mixcore/base';
import { StringHelper } from '@mixcore/helper';
import { DialogService } from '@ngneat/dialog';
import { CartStore } from '../../stores';
import {
  IPublicProductCategory,
  publicCategoryStore,
} from '../../stores/public-category.store';
import {
  categoryProductStore,
  IPublicProduct,
} from '../../stores/public-product.store';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { CurrencyComponent } from '../currency/currency.component';

@Component({
  selector: 'mix-product-by-category',
  imports: [CurrencyComponent, SlicePipe],
  templateUrl: './product-by-category.component.html',
  providers: [],
})
export class ProductByCategoryComponent extends BaseComponent {
  public categoryStore = inject(publicCategoryStore);
  public categoryProductStore = inject(categoryProductStore);
  public category = input.required<IPublicProductCategory>();
  public dialog = inject(DialogService);
  public cartStore = inject(CartStore);
  public router = inject(Router);

  public products = computed(() =>
    this.categoryProductStore
      .dataEntities()
      .filter((x) => x.category_id === this.category()?.id),
  );

  public loading = computed(
    () =>
      this.categoryStore.isLoading() || this.categoryProductStore.isLoading(),
  );

  public addToCart(product: IPublicProduct) {
    this.cartStore.addItem({
      id: StringHelper.generateUUID(),
      quantity: 1,
      productId: product.id,
      thumbnail: product.thumbnail,
      title: product.title,
      price: product.price,
      systemNote: '',
      customerNote: '',
    });

    this.dialog.open(CartModalComponent, { data: { isAddNew: true } });
  }

  public goToProductDetail(id: number) {
    this.router.navigate(['/product', id]);
  }

  public getProductAttributes(product: IPublicProduct) {
    return Object.entries(product.attributes || {}).map(([key, value]) => {
      return value;
    });
  }

  public getProductPrices(product: IPublicProduct) {
    return Object.entries(product.price_list || {}).map(([key]) => {
      return key;
    });
  }
}
