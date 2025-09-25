import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { EMixContentStatus, MixQuery } from '@mixcore/sdk-client';
import { debouncedSignal } from '@mixcore/signal';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixCurrencyComponent, provideCurrency } from '@mixcore/ui/currency';
import { injectDialog } from '@mixcore/ui/dialog';
import { MixStatusSelectComponent } from '@mixcore/ui/status-select';
import { MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';

import { CreateProductComponent } from 'apps/ecommerce-bo/src/components/create-product/create-product.component';
import { ProductStore } from 'apps/ecommerce-bo/src/state';
import { IProduct } from 'apps/ecommerce-bo/src/types';
import { explicitEffect } from 'ngxtension/explicit-effect';

@Component({
  selector: 'mix-product-list-page',
  templateUrl: './product-list.page.html',
  imports: [
    MixTableModule,
    MixCopyTextComponent,
    MixCurrencyComponent,
    MixButtonComponent,
    MixStatusSelectComponent,
    DatePipe,
    TranslocoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCurrency('vi-VN', 'VND')],
})
export class ProductListPage extends BasePageComponent {
  public store = inject(ProductStore);
  public router = injectMiniAppRouter();
  public dialog = injectDialog();
  public toast = injectToastService();

  public searchText = signal<string | undefined>(undefined);
  public searchTextDebounced = debouncedSignal(this.searchText, 300);

  constructor() {
    super();

    explicitEffect([this.searchTextDebounced], ([keyword]) => {
      if (keyword !== undefined) {
        const query = this.store
          .query()
          .like('title', keyword, { override: true });

        this.store.search(query);
      }
    });
  }

  override ngOnInit() {
    super.ngOnInit();

    this.store
      .search(new MixQuery().default(5).fromQueryParams(window.location.href))
      .subscribe();
  }

  public goDetail(id: number) {
    this.router.navigate(['product', id]);
  }

  public onCreate() {
    this.dialog.open(CreateProductComponent);
  }

  public onUpdateStatus(item: IProduct, status: EMixContentStatus) {
    if (!item || !status || item.status === status) return;

    const { success, error } = this.toast.loading(
      this.translate('common.update.processing'),
    );

    this.store.updateData({ ...item, status } as IProduct).subscribe({
      next: () => {
        success(this.translate('common.update.success'));
      },
      error: () => {
        error(this.translate('common.update.error'));
      },
    });
  }
}
