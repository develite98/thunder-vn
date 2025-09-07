import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { debouncedSignal } from '@mixcore/signal';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixCurrencyComponent, provideCurrency } from '@mixcore/ui/currency';
import { injectDialog } from '@mixcore/ui/dialog';
import { MixStatusIndicatorComponent } from '@mixcore/ui/status-indicator';
import { MixTableModule } from '@mixcore/ui/table';

import { injectDispatch } from '@ngrx/signals/events';
import { CreateProductComponent } from 'apps/ecommerce-bo/src/components/create-product/create-product.component';
import { productPageEvent, ProductStore } from 'apps/ecommerce-bo/src/state';

@Component({
  selector: 'mix-product-list-page',
  templateUrl: './product-list.page.html',
  imports: [
    MixTableModule,
    MixCopyTextComponent,
    MixCurrencyComponent,
    MixStatusIndicatorComponent,
    MixButtonComponent,
    DatePipe,
    TranslocoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCurrency('vi-VN', 'VND')],
})
export class ProductListPage extends BasePageComponent {
  public store = inject(ProductStore);
  public event = injectDispatch(productPageEvent);
  public router = injectMiniAppRouter();
  public dialog = injectDialog();

  public searchText = signal<string | undefined>(undefined);
  public searchTextDebounced = debouncedSignal(this.searchText, 300);

  constructor() {
    super();

    effect(() => {
      const keyword = this.searchTextDebounced();
      if (keyword !== undefined) {
        const query = this.store
          .query()
          .like('title', keyword, { override: true });

        this.event.searched(query);
      }
    });
  }

  override ngOnInit() {
    super.ngOnInit();

    this.event.opened(
      new MixQuery().default(5).fromQueryParams(window.location.href),
    );
  }

  public goDetail(id: number) {
    this.router.navigate(['product', id]);
  }

  public onCreate() {
    this.dialog.open(CreateProductComponent);
  }

  public onSearchTextChange(searchText: string | undefined) {
    console.log(searchText);
  }
}
