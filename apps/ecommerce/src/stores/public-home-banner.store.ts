import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD, withLocalStorage } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';

export interface HomeBanner {
  title: string;
  description: string;
  image: string;
  cta_button_text: string;
  cta_button_url: string;
}

export const publicBannerStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<HomeBanner>('mix_ecom_home_banner', query),
        getByIdFn: (id) =>
          client.table.getDataById<HomeBanner>(
            'mix_ecom_home_banner',
            <string>id,
          ),
      })),
  }),
  withLocalStorage('public-banners'),
);
