import { EMixContentStatus } from '@mixcore/sdk-client';
import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD, withLocalStorage } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';

export interface IPublicProduct {
  id: number;
  title: string;
  price: number;
  excerpt: string;
  status: EMixContentStatus;
  short_description: string;
  description: string;
  attributes: Record<string, string>;
  price_list: Record<string, number>;

  thumbnail: string;
  seo_url: string;
  media: { mediaList: string[] };
}

export const publicProductStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<IPublicProduct>('mix_product', query),
        getByIdFn: (id) =>
          client.table.getDataById<IPublicProduct>('mix_product', <string>id),
      })),
  }),
  withLocalStorage('public-products'),
);

export const publicProductListStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<IPublicProduct>('mix_product', query),
        getByIdFn: (id) =>
          client.table.getDataById<IPublicProduct>('mix_product', <string>id),
      })),
  }),
  withLocalStorage('public-products-list'),
);
