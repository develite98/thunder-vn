import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { MixQuery } from '@mixcore/sdk-client';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { provideCurrency } from '@mixcore/ui/currency';
import { MixStatusIndicatorComponent } from '@mixcore/ui/status-indicator';
import { MixTableModule } from '@mixcore/ui/table';

import { injectDispatch } from '@ngrx/signals/events';
import {
  productCategoryPageEvent,
  ProductCategoryStore,
} from 'apps/ecommerce-bo/src/state';

@Component({
  selector: 'mix-product-categories-page',
  templateUrl: './product-categories.page.html',
  imports: [
    MixTableModule,
    MixCopyTextComponent,
    MixStatusIndicatorComponent,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCurrency('vi-VN', 'VND')],
})
export class ProductCategoriesPage {
  public store = inject(ProductCategoryStore);
  public event = injectDispatch(productCategoryPageEvent);
  public router = injectMiniAppRouter();

  constructor() {
    this.event.opened(
      new MixQuery().default(5).fromQueryParams(window.location.href),
    );
  }

  public goDetail(id: number) {
    this.router.navigate(['product-category', id]);
  }
}
