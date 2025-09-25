import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixCurrencyComponent } from '@mixcore/ui/currency';
import { injectDialog } from '@mixcore/ui/dialog';
import { MixInlineInputComponent } from '@mixcore/ui/inline-input';
import { injectModalService } from '@mixcore/ui/modal';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';
import { SearchProductComponent } from 'apps/ecommerce-bo/src/components/search-product/search-product.component';
import {
  CategoryProductRelationStore,
  ProductCategoryStore,
  ProductStore,
} from 'apps/ecommerce-bo/src/state';
import { ICategoryProduct, IProduct } from 'apps/ecommerce-bo/src/types';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'mix-product-category-product-list',
  templateUrl: './product-list.page.html',
  imports: [
    MixTableModule,
    MixButtonComponent,
    MixCurrencyComponent,
    MixCopyTextComponent,
    MixInlineInputComponent,
    TranslocoPipe,
  ],
  providers: [ProductStore],
})
export class ProductCategoryProductListPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly store = inject(ProductCategoryStore);
  readonly categoryProductRelationStore = inject(CategoryProductRelationStore);
  readonly productStore = inject(ProductStore);

  readonly modal = injectModalService();
  readonly dialog = injectDialog();
  readonly toast = injectToastService();

  readonly data = this.store.selectEntityById(this.id);
  readonly contextMenu: GridContextMenu<ICategoryProduct>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.onRemoveProduct(item.id),
      iconClass: 'text-error',
    },
  ];

  constructor() {
    super();

    explicitEffect([this.id], ([id]) => {
      if (id) {
        const query = new MixQuery().default(50).equal('category_id', id);
        this.categoryProductRelationStore.search(query).subscribe();
      }
    });

    explicitEffect(
      [this.categoryProductRelationStore.dataEntities],
      ([data]) => {
        if (data?.length) {
          const query = new MixQuery()
            .default(50)
            .inRange('id', data.map((x) => x.product_id).join(', '));

          this.productStore.search(query).subscribe();
        }
      },
    );
  }

  public onRemoveProduct(id: number) {
    if (!id) return;

    this.modal.asKForAction(
      this.translate('common.delete.confirmation'),
      () => {
        const value = this.data();
        if (!value) return;

        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translate('common.delete.processing'),
        );

        this.categoryProductRelationStore.deleteDataById(id).subscribe({
          next: () => {
            toastSuccess(this.translate('common.delete.success'));

            const query = new MixQuery()
              .default(10)
              .equal('category_id', value.id);

            this.categoryProductRelationStore.search(query).subscribe();
          },
          error: () => {
            toastError(this.translate('common.delete.error'));
          },
        });
      },
    );
  }

  public onAddProduct() {
    const ref = this.dialog.open(SearchProductComponent);
    ref.afterClosed$.subscribe((result: IProduct[] | undefined) => {
      if (!result) return;

      const data = this.categoryProductRelationStore.dataEntities();
      const toAddProducts = result.filter(
        (x) => !data.some((r) => r.product_id === x.id),
      );

      const request = toAddProducts.map((x, index) => {
        const request = {
          category_id: this.id(),
          product_id: x.id,
          priority: data.length + index + 1,
        };

        return this.categoryProductRelationStore.createData(
          request as unknown as ICategoryProduct,
        );
      });

      if (request.length > 0) {
        const { success, error } = this.toast.loading(
          'Adding products to category...',
        );

        forkJoin(request).subscribe({
          next: () => {
            success('Products added to category successfully');
          },
          error: () => {
            error('Failed to add products to category');
          },
        });
      }
    });
  }

  public onUpdatePriority(item: ICategoryProduct, priority: number) {
    if (!item || !priority || item.priority === priority) return;

    const { success, error } = this.toast.loading(
      this.translate('common.update.processing'),
    );

    this.categoryProductRelationStore
      .updateData({ ...item, priority } as ICategoryProduct)
      .subscribe({
        next: () => {
          success(this.translate('common.update.success'));
        },
        error: () => {
          error(this.translate('common.update.error'));
        },
      });
  }
}
