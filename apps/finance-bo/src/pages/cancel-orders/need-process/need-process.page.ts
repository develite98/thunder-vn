import { Component, inject, signal } from '@angular/core';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixDateRangePickerComponent } from '@mixcore/ui/date-picker';
import { MixTableModule } from '@mixcore/ui/table';

import { DatePipe } from '@angular/common';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectDispatch } from '@ngrx/signals/events';
import { RequestStore, requestPageEvent } from 'apps/finance-bo/src/state';
import { BranchStore } from 'apps/finance-bo/src/state/stores/branch.store';
import {
  ENotificationStatus,
  ENotificationType,
  IGetPosRequest,
  IPosRequest,
} from 'apps/finance-bo/src/types';

@Component({
  selector: 'mix-finance-cancel-orders-page-need-process',
  templateUrl: './need-process.page.html',
  imports: [
    MixBreadcrumbsModule,
    MixTableModule,
    MixCopyTextComponent,
    MixDateRangePickerComponent,

    DatePipe,
  ],
})
export class FinanceVoidBillNeedProcess extends BasePageComponent {
  readonly router = injectMiniAppRouter();
  readonly store = inject(RequestStore);
  readonly event = injectDispatch(requestPageEvent);
  readonly branchStore = inject(BranchStore);

  public searchDateRange = signal<{ from: Date; to: Date } | null>(null);
  public searchId = signal<{ from: Date; to: Date } | null>(null);

  constructor() {
    super();

    this.event.opened({
      query: new IGetPosRequest({
        statuses: [ENotificationStatus.New],
        types: [ENotificationType.CancelPaidOrder],
      }).default(50),
    });
  }

  public onRowClick(row: IPosRequest) {
    this.router.navigate(['void-bill', row.id, row.data.orderId as string]);
  }

  public onDateChange(value: { from: Date; to: Date }) {
    this.searchDateRange.set(value);
  }
}
