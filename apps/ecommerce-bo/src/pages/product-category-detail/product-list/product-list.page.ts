import { DatePipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCurrencyComponent } from '@mixcore/ui/currency';
import { injectDialog } from '@mixcore/ui/dialog';
import { injectModalService } from '@mixcore/ui/modal';
import { MixStatusIndicatorComponent } from '@mixcore/ui/status-indicator';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';
import { SearchProductComponent } from 'apps/ecommerce-bo/src/components/search-product/search-product.component';
import {
  ProductCategoryStore,
  ProductStore,
} from 'apps/ecommerce-bo/src/state';
import { IProduct } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-product-category-product-list',
  templateUrl: './product-list.page.html',
  imports: [
    MixTableModule,
    MixButtonComponent,
    MixCurrencyComponent,
    MixStatusIndicatorComponent,
    DatePipe,
    TranslocoPipe,
  ],
  providers: [ProductStore],
})
export class ProductCategoryProductListPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly store = inject(ProductCategoryStore);
  readonly productStore = inject(ProductStore);
  readonly modal = injectModalService();
  readonly dialog = injectDialog();
  readonly toast = injectToastService();

  readonly data = this.store.selectEntityById(this.id);
  readonly contextMenu: GridContextMenu<IProduct>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.onRemoveProduct(item.seo_url),
      iconClass: 'text-error',
    },
  ];

  constructor() {
    super();

    effect(() => {
      const data = this.data();
      if (!data) return;

      const slugs = (data.product_slugs?.split(',') || [])
        .map((slug) => slug.trim())
        .filter(Boolean);

      if (!slugs) return;

      if (slugs.length > 0) {
        let query = new MixQuery().default(100);
        query.conjunction = 'Or';

        slugs.forEach((slug) => {
          query = query.equal('seo_url', slug);
        });

        this.productStore.search(query).subscribe();
      }
    });
  }

  public onRemoveProduct(id: string | undefined) {
    if (!id) return;

    this.modal.asKForAction('Are you sure to remove this data', () => {
      const value = this.data();
      if (!value) return;

      let slugs = (value.product_slugs?.split(',') || []).map((slug) =>
        slug.trim(),
      );

      slugs = slugs.filter((slug) => slug !== id.toString());
      const productSlugs = slugs.join(',');

      const { success: toastSuccess, error: toastError } = this.toast.loading(
        'Trying to delete product...',
      );

      this.store
        .updateData(
          {
            ...value,
            product_slugs: productSlugs,
          },
          {
            success: () => {
              toastSuccess('Product removed successfully');
            },
          },
        )
        .subscribe();
    });
  }

  public onAddProduct() {
    const ref = this.dialog.open(SearchProductComponent);
    ref.afterClosed$.subscribe((result) => {
      if (!result) return;

      const value = this.data();
      if (!value) return;

      let slugs = (value.product_slugs?.split(',') || []).map((slug) =>
        slug.trim(),
      );

      if (!slugs.includes(result.seo_url)) {
        slugs.push(result.seo_url);
      }

      const productSlugs = slugs.join(',');

      const { success: toastSuccess, error: toastError } = this.toast.loading(
        'Trying to addd product...',
      );

      this.store
        .updateData(
          {
            ...value,
            product_slugs: productSlugs,
          },
          {
            success: () => {
              toastSuccess('Product added successfully');
            },
          },
        )
        .subscribe();
    });
  }
}
