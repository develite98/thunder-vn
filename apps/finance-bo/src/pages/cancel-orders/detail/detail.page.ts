import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BasePageComponent } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { injectParams } from '@mixcore/router';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixCurrencyComponent } from '@mixcore/ui/currency';
import { injectModalService } from '@mixcore/ui/modal';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { MixTileComponent } from '@mixcore/ui/tile';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import {
  OrderStore,
  requestPageEvent,
  RequestStore,
} from 'apps/finance-bo/src/state';
import { BranchStore } from 'apps/finance-bo/src/state/stores/branch.store';
import { ReceiptStore } from 'apps/finance-bo/src/state/stores/receipt.store';
import { ENotificationStatus } from 'apps/finance-bo/src/types';

@Component({
  selector: 'mix-e-invoice-detail-page',
  templateUrl: './detail.page.html',
  imports: [
    MixTileComponent,
    MixPageContainerComponent,
    MixButtonComponent,
    MixCopyTextComponent,
    MixCurrencyComponent,
    DatePipe,
    ReactiveFormsModule,
  ],
})
export class EInvoiceDetailPage extends BasePageComponent {
  readonly modal = injectModalService();
  readonly toast = injectToastService();

  readonly event = injectDispatch(requestPageEvent);
  readonly orderId = injectParams('orderId');
  readonly requestId = injectParams('requestId');

  readonly orderStore = inject(OrderStore);
  readonly requestStore = inject(RequestStore);
  readonly branchStore = inject(BranchStore);
  readonly receiptStore = inject(ReceiptStore);

  readonly order = this.orderStore.selectEntityById(this.orderId);
  readonly request = this.requestStore.selectEntityById(this.requestId);

  public canDelete = false;
  public form = new FormControl('', Validators.required);

  public branch = computed(() => {
    const branchId = this.request()?.branchId;
    return branchId ? this.branchStore.dataEntityMap()[branchId] : undefined;
  });

  public receipt = computed(() => {
    const order = this.order();
    if (!order?.id) return null;

    return this.receiptStore.dataEntityMap()[order.id] || null;
  });

  public notification = computed(() => {
    const request = this.request();
    if (!request) return '';

    return this.templateMap(
      this.flattenObject(request.data as unknown as Record<string, string>),
      request.originTemplate,
    );
  });

  public isProcessed = computed(() => {
    return (
      this.request()?.notificationStatus === ENotificationStatus.Proccessed
    );
  });

  constructor() {
    super();

    effect(() => {
      const request = this.request();
      if (request) this.orderStore.getById(request.data.orderId).subscribe();
    });

    this.form.valueChanges.subscribe((value) => {
      this.canDelete = value === 'CONFIRM';
    });
  }

  public submit(type: 'approve' | 'reject' = 'approve') {
    if (FormUtils.validateForm(this.form)) {
      this.modal.asKForAction(
        'Are you sure you want to void this bill?',
        () => {
          const request = this.request();
          if (!request) return;
          if (type === 'approve') {
            this.requestStore
              .approveRequest(request)
              .pipe(
                this.toast.observe({
                  success: 'The request has been approved successfully.',
                  error: 'Failed to approve the request.',
                }),
              )
              .subscribe();
          } else {
            this.requestStore
              .rejectRequest(request)
              .pipe(
                this.toast.observe({
                  success: 'The request has been rejected successfully.',
                  error: 'Failed to reject the request.',
                }),
              )
              .subscribe();
          }
        },
      );
    } else {
      this.toast.error('Please confirm the action by typing "CONFIRM"');
    }
  }

  public titlecase = (input: string) => {
    const words = input.split(' ');
    const titleCasedWords = words.map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word.toLowerCase();
      }
    });

    return titleCasedWords.join(' ');
  };

  public flattenObject(
    obj: Record<string, string>,
    parentKey = '',
    result: Record<string, string> = {},
  ) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = parentKey
          ? `${this.titlecase(parentKey)}.${this.titlecase(key)}`
          : this.titlecase(key);

        if (typeof obj[key] === 'object' && obj[key] !== null) {
          this.flattenObject(obj[key], newKey, result);
        } else {
          result[newKey] = obj[key];
        }
      }
    }

    return result;
  }

  public templateMap(object: Record<string, string>, template: string) {
    let result = template;

    const boldingText = (text: string) =>
      `<span class="font-semibold text-primary-200">${text}</span>`;

    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        result = result?.replace(
          new RegExp(`{{${key}}}`, 'g'),
          boldingText(object[key]),
        );
      }
    }

    return result;
  }
}
