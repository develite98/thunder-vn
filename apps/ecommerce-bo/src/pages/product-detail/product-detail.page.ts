import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { EMixContentStatus } from '@mixcore/sdk-client';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { StatusSelectComponent } from '../../components';
import { productDetailPageEvent, ProductStore } from '../../state';

@Component({
  selector: 'mix-product-detail-page',
  templateUrl: './product-detail.page.html',
  imports: [MixPageContainerComponent, RouterOutlet, StatusSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailpage extends BasePageComponent {
  readonly translateSrv = inject(TranslocoService);
  readonly toast = injectToastService();
  readonly event = injectDispatch(productDetailPageEvent);
  readonly id = injectParams('id');
  readonly store = inject(ProductStore);
  readonly tabs = computed(() => {
    const id = this.id();
    return [
      {
        id: '1',
        title: 'ecommerce.product.tab.config',
        route: ['product', id, 'config'],
        icon: 'settings',
      },
      {
        id: '2',
        title: 'common.seo',
        route: ['product', id, 'seo'],
        icon: 'search',
      },
      {
        id: '3',
        title: 'common.image',
        route: ['product', id, 'media'],
        icon: 'image',
      },
    ] as ITabItem[];
  });

  public data = this.store.selectEntityById(this.id);

  constructor() {
    super();
    effect(() => {
      const id = this.id();
      if (!id) return;

      this.event.pageOpened({ data: id });
    });
  }

  public onStatusChange(status: EMixContentStatus | undefined) {
    const data = this.data();
    if (data) {
      data.status = status || EMixContentStatus.Draft;

      const { success: toastSuccess, error: toastError } = this.toast.loading(
        this.translateSrv.translate('Trying to update product...'),
      );

      this.event.updated({
        data: data,
        callback: {
          success: () => {
            toastSuccess(
              this.translateSrv.translate('Product updated successfully'),
            );
          },
          error: (error) => {
            toastError(
              this.translateSrv.translate('Error updating product') +
                ' ' +
                error,
            );
          },
        },
      });
    }
  }
}
