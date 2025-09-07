import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixDeleteComponent } from '@mixcore/ui/delete';
import { injectDialog } from '@mixcore/ui/dialog';
import { injectModalService } from '@mixcore/ui/modal';
import { MixTileComponent } from '@mixcore/ui/tile';
import { injectToastObserve, injectToastService } from '@mixcore/ui/toast';
import { CurrencyComponent } from 'apps/ecommerce/src/components';
import { agencyOrderStore } from 'apps/ecommerce/src/stores';
import { IOrder, OrderHelper, OrderStatus } from 'apps/ecommerce/src/types';

@Component({
  selector: 'app-ecom-agency-order-detail',
  templateUrl: './order-detail.page.html',
  imports: [
    MixTileComponent,
    DatePipe,
    MixButtonComponent,
    MixDeleteComponent,
    CurrencyComponent,
  ],
})
export class AgencyOrderDetalPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly orderStore = inject(agencyOrderStore);

  readonly dialog = injectDialog();
  readonly modal = injectModalService();
  readonly toast = injectToastService();

  readonly toastObserver = injectToastObserve();

  readonly data = this.orderStore.selectEntityById(this.id);

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

    return OrderHelper.calculateTotalPrice(data as unknown as IOrder);
  });

  constructor() {
    super();

    this.orderStore.getById(this.id()!).subscribe();
  }

  public isPastThreshold(dateString: Date, hours: number = 0.2): boolean {
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
