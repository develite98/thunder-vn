import { MixQuery } from '@mixcore/sdk-client';
import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD, withLocalStorage, withStatus } from '@mixcore/signal';

import { signalStore, withHooks } from '@ngrx/signals';

export interface IWebsiteBuilder {
  id: string;
  value: {
    data: Record<string, unknown>;
  };
  key: string;
  description: string;
  status: string;
  data: Record<string, unknown>;
}

export const websiteBuilderStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table
            .filterData<IWebsiteBuilder>('mix_website_builder', query)
            .then((result) => {
              result.items = result.items.map((item) => ({
                ...item,
                id: item.key,
                value: item.value || {},
                data: item.value?.data || {},
              }));

              return result;
            }),
      })),
  }),
  withHooks((store) => ({
    onInit: () => {
      store
        .search(new MixQuery().default(50).select('value', 'key'))
        .subscribe();
    },
  })),
  withStatus(),
  withLocalStorage('website-builder'),
);
