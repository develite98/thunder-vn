import { inject } from '@angular/core';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { OrderApi } from '../../api-service/order.api';
import { IOrder } from '../../types';

export const OrderStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IOrder>({
    apiFactory: () => {
      const api = inject(OrderApi);
      return {
        getByIdFn: (id) => api.getOrderById(id as string),
      };
    },
  }),
);
