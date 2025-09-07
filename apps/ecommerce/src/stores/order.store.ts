import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD } from '@mixcore/signal';

import { signalStore } from '@ngrx/signals';

export interface IPublicOrder {
  created_by: string;
  created_date: Date;
  updated_date: Date;
  id: number;
  address: string;
  email: string;
  phone_number: string;
  agency_id?: number;
  order_status: string;
  order_items: IOrderItems;
  customer_name: string;
}

export interface IOrderItems {
  data: IOrderItemData[];
}

export interface IOrderItemData {
  id: string;
  quantity: number;
  productId: number;
  thumbnail: string;
  title: string;
  systemNote?: string;
  price: number;
}

export const publicOrderStpre = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<IPublicOrder>('mix_ecom_order', query),
        getByIdFn: (id) =>
          client.table.getDataById<IPublicOrder>('mix_ecom_order', <string>id),
        createFn: (data) =>
          client.table.createData<IPublicOrder>('mix_ecom_order', data),
      })),
  }),
);

export const agencyOrderStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<IPublicOrder>('mix_ecom_order', query),
        getByIdFn: (id) =>
          client.table.getDataById<IPublicOrder>('mix_ecom_order', <string>id),
        createFn: (data) =>
          client.table.createData<IPublicOrder>('mix_ecom_order', data),
      })),
  }),
);
