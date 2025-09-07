import { Component, inject } from '@angular/core';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';

import { ITabItem } from '@mixcore/ui/tabs';

import { RouterOutlet } from '@angular/router';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectQueryParam } from '@mixcore/router';
import { injectDispatch } from '@ngrx/signals/events';
import { requestPageEvent, RequestStore } from '../../state';
import { BranchStore } from '../../state/stores/branch.store';

@Component({
  selector: 'mix-finance-cancel-orders-page',
  templateUrl: './cancel-orders.page.html',
  imports: [MixBreadcrumbsModule, MixPageContainerComponent, RouterOutlet],
})
export class FinanceCancelOrders extends BasePageComponent {
  readonly router = injectMiniAppRouter();
  readonly store = inject(RequestStore);
  readonly event = injectDispatch(requestPageEvent);
  readonly branchStore = inject(BranchStore);
  readonly queryParams = injectQueryParam('type');

  readonly tabs = [
    {
      id: '1',
      title: 'finance.invoice.tab.inprogress',
      icon: 'calendar-clock',
      route: ['void-bill', 'need-process'],
    },
    {
      id: '1',
      title: 'finance.invoice.tab.all',
      icon: 'calendar-check-2',
      route: ['void-bill', 'processed'],
    },
  ] as ITabItem[];
}
