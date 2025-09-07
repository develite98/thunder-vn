import { Component, computed, inject } from '@angular/core';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { injectModalService } from '@mixcore/ui/modal';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';

import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { ITabItem } from '@mixcore/ui/tabs';
import { productCategoryPageEvent, ProductCategoryStore } from '../../state';

@Component({
  selector: 'mix-product-category-detail-page',
  templateUrl: './product-category-detail.page.html',
  imports: [
    RouterOutlet,
    MixPageContainerComponent,
    MixBreadcrumbsModule,
    TranslocoPipe,
  ],
})
export class ProductCategoryDetailPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly store = inject(ProductCategoryStore);
  readonly toast = injectToastService();
  readonly event = injectDispatch(productCategoryPageEvent);
  readonly modal = injectModalService();
  readonly router = injectMiniAppRouter();
  readonly client = injectMixClient();
  readonly tabs = computed(() => {
    return [
      {
        id: '1',
        title: 'table.tab.config',
        route: ['product-category', this.id(), 'config'],
        icon: 'settings',
      },
      {
        id: '2',
        title: 'ecommerce.productCategory.tab.productList',
        route: ['product-category', this.id(), 'products'],
        icon: 'list',
      },
    ] as ITabItem[];
  });

  public data = this.store.selectEntityById(this.id);

  constructor() {
    super();

    this.store.getById(this.id()!).subscribe();
  }
}
