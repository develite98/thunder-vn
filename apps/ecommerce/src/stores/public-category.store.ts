import { EMixContentStatus } from '@mixcore/sdk-client';
import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD, withLocalStorage } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';

export interface IPublicProductCategory {
  id: number;
  title: string;
  description: string;
  status: EMixContentStatus;
  product_slugs: string;
  long_description: string;
}

export const publicCategoryStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<IPublicProductCategory>(
            'mix_ecom_product_category',
            query,
          ),
        getByIdFn: (id) =>
          client.table.getDataById<IPublicProductCategory>(
            'mix_ecom_product_category',
            <string>id,
          ),
      })),
  }),
  withLocalStorage('public-categories'),
);
