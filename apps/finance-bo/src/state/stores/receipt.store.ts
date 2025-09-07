import { inject } from '@angular/core';
import { setEntity, withCRUD } from '@mixcore/signal';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withMethods } from '@ngrx/signals';
import { from } from 'rxjs';
import { ReceiptApi } from '../../api-service';
import { IReceipt } from '../../types';

export const ReceiptStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IReceipt>({}),
  withMethods((store, api = inject(ReceiptApi)) => ({
    getByOrderId: (orderId: string, branchId: number, saleDay: Date) => {
      return from(api.getByOrderId(orderId, branchId, saleDay)).pipe(
        mapResponse({
          next: (result) => {
            setEntity(store, result);
          },
          error: (err) => {
            console.error('Error fetching receipt by order ID:', err);
          },
        }),
      );
    },
  })),
);
