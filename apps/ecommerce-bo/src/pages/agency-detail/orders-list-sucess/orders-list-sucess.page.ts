import { Component, inject } from '@angular/core';
import { MixQuery } from '@mixcore/sdk-client';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixTableModule } from '@mixcore/ui/table';

import { DatePipe, DecimalPipe } from '@angular/common';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { injectParams } from '@mixcore/router';
import { injectDialog } from '@mixcore/ui/dialog';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import { AgencyStore, OrderStore } from 'apps/ecommerce-bo/src/state';
import { IAgency, OrderHelper, OrderStatus } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-ecommerce-orders-list-sucess-page',
  templateUrl: './orders-list-sucess.page.html',
  standalone: true,
  imports: [MixTableModule, MixCopyTextComponent, DatePipe, DecimalPipe],
  providers: [OrderStore],
})
export class EcomOrderListSuccessPage {
  readonly id = injectParams('id');
  readonly dialog = injectDialog();
  readonly modal = injectModalService();
  readonly toast = injectToastService();
  readonly store = inject(OrderStore);
  readonly agencyStore = inject(AgencyStore);
  readonly router = injectMiniAppRouter();

  public calculatePrice = OrderHelper.calculateTotalPrice;
  public getLabel = OrderHelper.getOrderStatusLabel;

  constructor() {
    this.store
      .search(
        new MixQuery()
          .default(5)
          .equal('order_status', OrderStatus.Completed)
          .equal('agency_id', this.id())
          .fromQueryParams(window.location.href),
      )
      .subscribe();
  }

  public goDetail(id: number) {
    this.router.navigate(['order', id]);
  }

  public onEdit(id: number) {
    this.router.navigate(['order', id]);
  }

  public getAgencyName(agencyId: number, agency: IAgency[]) {
    return agency.find((x) => x.id === agencyId)?.title || 'N/A';
  }
}
