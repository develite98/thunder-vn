import { Component, inject } from '@angular/core';
import { MixQuery } from '@mixcore/sdk-client';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';

import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { injectParams } from '@mixcore/router';
import { injectDialog } from '@mixcore/ui/dialog';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import { AgencyStore, OrderStore } from 'apps/ecommerce-bo/src/state';
import {
  IAgency,
  IOrder,
  OrderHelper,
  OrderStatus,
} from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-ecommerce-orders-inprogress-list-page',
  templateUrl: './orders-list.page.html',
  standalone: true,
  imports: [
    MixTableModule,
    MixCopyTextComponent,
    TranslocoPipe,
    DatePipe,
    DecimalPipe,
  ],
  providers: [OrderStore],
})
export class EcomAgencyOrdeInprogressListPage {
  readonly id = injectParams('id');
  readonly dialog = injectDialog();
  readonly modal = injectModalService();
  readonly toast = injectToastService();
  readonly store = inject(OrderStore);
  readonly agencyStore = inject(AgencyStore);
  readonly router = injectMiniAppRouter();
  readonly contextMenu: GridContextMenu<IOrder>[] = [
    {
      label: 'ecommerce.notifyAgency',
      icon: 'bell',
      action: (item) => this.onNotifyAgency(item.agency_id),
      iconClass: 'text-warning',
    },
  ];

  public calculatePrice = OrderHelper.calculateTotalPrice;
  public getLabel = OrderHelper.getOrderStatusLabel;

  constructor() {
    this.store
      .search(
        new MixQuery()
          .default(5)
          .equal('order_status', OrderStatus.New)
          .equal('agency_id', this.id())
          .fromQueryParams(window.location.href),
      )
      .subscribe();
  }

  public onEdit(id: number) {
    this.router.navigate(['order', id]);
  }

  public goDetail(id: number) {
    this.router.navigate(['order', id]);
  }

  public getAgencyName(agencyId: number, agency: IAgency[]) {
    return agency.find((x) => x.id === agencyId)?.title || 'N/A';
  }

  public onNotifyAgency(agencyId: number) {
    this.toast.success('Đã nhắc nhở đại lý...');
  }

  public isPastThreshold(dateString: string, hours: number = 0.2): boolean {
    const targetDate = new Date(dateString);
    const now = new Date();

    const diffInMs = now.getTime() - targetDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours > hours;
  }
}
