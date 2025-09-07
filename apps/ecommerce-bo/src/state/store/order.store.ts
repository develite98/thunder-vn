import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { IOrder } from '../../types';

const DB_NAME = 'mix_ecom_order';

export const OrderStore = signalStore(
  withCRUD<IOrder>({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) => client.table.filterData<IOrder>(DB_NAME, query),
        getByIdFn: (id) =>
          client.table.getDataById<IOrder>(DB_NAME, <string>id),
        deleteFn: (id) => client.table.deleteData(DB_NAME, <string>id),
        updateFn: (data) =>
          client.table.updateData<IOrder>(DB_NAME, data.id, data),
      })),
  }),
);
