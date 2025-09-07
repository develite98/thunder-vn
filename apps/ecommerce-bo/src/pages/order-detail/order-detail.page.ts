import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixQuery } from '@mixcore/sdk-client';
import { MixDeleteComponent } from '@mixcore/ui/delete';
import { injectDialog } from '@mixcore/ui/dialog';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectModalService } from '@mixcore/ui/modal';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';
import { MixTileComponent } from '@mixcore/ui/tile';
import { injectToastObserve, injectToastService } from '@mixcore/ui/toast';
import { AgencyStore, OrderStore } from '../../state';
import { IAgency, OrderHelper, OrderStatus } from '../../types';

@Component({
  selector: 'mix-ecom-order-detail-page',
  templateUrl: './order-detail.page.html',
  imports: [
    MixPageContainerComponent,
    DecimalPipe,
    MixTileComponent,
    TranslocoPipe,
    MixIconComponent,
    MixDeleteComponent,
  ],
  providers: [OrderStore, AgencyStore],
})
export class EcomOrderDetailPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly orderStore = inject(OrderStore);
  readonly agencyStore = inject(AgencyStore);

  readonly dialog = injectDialog();
  readonly modal = injectModalService();
  readonly toast = injectToastService();

  readonly toastObserver = injectToastObserve();

  readonly data = this.orderStore.selectEntityById(this.id);
  readonly tabs = computed(() => {
    const id = this.id();
    return [
      {
        title: 'ecommerce.tab.mainInfo',
        id: '1',
        route: ['agency', id, 'config'],
        icon: 'list',
      },
    ] as ITabItem[];
  });

  public isProcessing = computed(() => {
    const data = this.data();
    return data?.order_status === OrderStatus.New;
  });

  public isCompleted = computed(() => {
    const data = this.data();
    return data?.order_status === OrderStatus.Completed;
  });

  public totalPrice = computed(() => {
    const data = this.data();
    if (!data) return 0;

    return OrderHelper.calculateTotalPrice(data);
  });

  constructor() {
    super();

    this.orderStore.getById(this.id()!).subscribe();
    this.agencyStore
      .search(new MixQuery().default(100).select('id', 'title'))
      .subscribe();
  }

  public getAgencyName(agencyId: number, agency: IAgency[]) {
    return agency.find((x) => x.id === agencyId)?.title || 'N/A';
  }

  public onNotifyAgency() {
    this.toast.success('Đã nhắc nhở đại lý...');
  }

  public isPastThreshold(dateString: string, hours: number = 0.2): boolean {
    const targetDate = new Date(dateString);
    const now = new Date();

    const diffInMs = now.getTime() - targetDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours > hours;
  }

  public changeOrderStatus(status: string) {
    const data = this.data();
    if (!data) return;

    this.modal.asKForAction(
      `Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng?`,
      () => {
        this.orderStore
          .updateData({
            ...data,
            order_status: status as OrderStatus,
          })
          .pipe(
            this.toastObserver({
              success: 'Đã cập nhật trạng thái đơn hàng thành công.',
              error: 'Cập nhật trạng thái đơn hàng thất bại.',
              loading: 'Đang cập nhật trạng thái đơn hàng...',
            }),
          )
          .subscribe({});
      },
    );
  }
}
