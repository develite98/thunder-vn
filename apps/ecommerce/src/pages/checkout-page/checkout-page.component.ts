import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalService } from '@mixcore/ui/modal';

import { EMixContentStatus, MixQuery } from '@mixcore/sdk-client';
import { injectToastService } from '@mixcore/ui/toast';
import {
  BreadcrumbComponent,
  CurrencyComponent,
  LocationSelectorComponent,
  PublicFooterComponent,
  PublicHeaderComponent,
} from '../../components';
import {
  CartStore,
  IAgencyAddress,
  IPublicAgency,
  IPublicOrder,
  publicAgencyStore,
  publicOrderStpre,
} from '../../stores';
import { IOrder, OrderHelper, OrderStatus } from '../../types';

@Component({
  selector: 'mix-checkout-page',
  imports: [
    PublicHeaderComponent,
    PublicFooterComponent,
    BreadcrumbComponent,
    CurrencyComponent,
    ReactiveFormsModule,
    RouterModule,
    LocationSelectorComponent,
    DecimalPipe,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent {
  public breadcrumb = [
    {
      label: 'Trang chủ',
      url: '/',
    },
    {
      label: 'Đặt hàng',
      url: '/checkout',
    },
  ];

  public cartStore = inject(CartStore);
  public orderStore = inject(publicOrderStpre);
  public agencyStore = inject(publicAgencyStore);
  public modal = inject(ModalService);
  public toast = injectToastService();
  public showSuccess = signal(false);
  public locationSelect = signal<IAgencyAddress | null>(null);

  public form = new FormGroup({
    customer_name: new FormControl('', Validators.required),
    phone_number: new FormControl('', Validators.required),
    agency_id: new FormControl(),
    address: new FormControl('', Validators.required),
  });

  public selectedAgency = signal<IPublicAgency | null>(null);
  public nearestAgency = signal<IPublicAgency[]>([]);
  public validAgency = signal<IPublicAgency[]>([]);

  public successOrder = signal<IOrder | null>(null);

  public totalPrice = computed(() => {
    const data = this.successOrder();
    if (!data) return 0;

    return OrderHelper.calculateTotalPrice(data);
  });

  constructor() {
    this.agencyStore.search(new MixQuery().default(50)).subscribe();
  }

  public onSubmit = () => {
    this.modal.asKForAction(
      'Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng',
      () => {
        const data = this.form.getRawValue() as IPublicOrder;
        const orderItems = this.cartStore.items();

        data.address = `${this.locationSelect()?.province?.name}, ${this.locationSelect()?.ward?.name}, ${data.address}`;
        data.order_items = { data: orderItems };
        data.agency_id = this.selectedAgency()?.id;
        data.order_status = OrderStatus.New;
        data.created_date = new Date();
        data.updated_date = new Date();

        this.orderStore
          .createData(data)
          .pipe(
            this.toast.observe({
              loading: 'Đang tiến hành đặt hàng',
              success: 'Thành công đặt hàng',
              error: 'Có lỗi xảy ra, xin vui lòng thử lại sau',
            }),
          )
          .subscribe({
            next: (result) => {
              this.showSuccess.set(true);
              this.successOrder.set(result as unknown as IOrder);
            },
          });
      },
      undefined,
      {
        title: 'Xác nhận đặt hàng',
        okLabel: 'Đặt hàng',
        cancelLabel: 'Kiểm tra lại',
      },
    );
  };

  public onLocationChange = (location: IAgencyAddress) => {
    this.locationSelect.set(location);

    const nearestAgencies: IPublicAgency[] = [];
    const validAgencies: IPublicAgency[] = [];

    this.agencyStore.dataEntities().forEach((a) => {
      if (
        a.addresses?.data?.some((addr) => {
          return (
            addr.province?.name === location.province?.name &&
            addr.ward?.name === location.ward?.name
          );
        })
      ) {
        nearestAgencies.push(a);
      } else if (
        a.addresses?.data?.some((addr) => {
          return addr.province?.name === location.province?.name;
        })
      ) {
        validAgencies.push(a);
      } else if (a.status === EMixContentStatus.All) {
        validAgencies.push(a);
      }
    });

    this.nearestAgency.set(nearestAgencies);
    this.validAgency.set(validAgencies);
    this.selectedAgency.set(nearestAgencies[0] ?? validAgencies[0] ?? null);
  };
}
