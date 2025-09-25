import { EMixContentStatus, MixQuery } from '@mixcore/sdk-client';
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

export interface ICategoryProduct {
  product_id: number;
  category_id: number;
  priority: number;
  id: number;
  product?: IPublicProduct;
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

export const categoryProductStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: async (query) => {
          const category = await client.table.filterData<ICategoryProduct>(
            'category_product',
            query,
          );

          if (category.items?.length) {
            const productIds = category.items
              .map((i) => i.product_id)
              .join(', ');

            const products = await client.table.filterData<IPublicProduct>(
              'mix_product',
              new MixQuery()
                .inRange('id', productIds)
                .select(
                  'title',
                  'created_date_time',
                  'price',
                  'thumbnail',
                  'price_list',
                  'seo_url',
                )
                .equal('status', EMixContentStatus.Published),
            );

            category.items = category.items.map((cat) => {
              const prod = products.items?.find((p) => p.id === cat.product_id);
              return { ...cat, product: prod };
            });
          }

          return category;
        },
      })),
  }),
);
