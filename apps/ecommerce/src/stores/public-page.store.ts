import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD, withLocalStorage } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';

export interface IPublicPage {
  id: number;
  seo_title: string;
  seo_url: string;
  description: string;
}

export const PublicPageStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        getByIdFn: (id) =>
          client.table
            .getDataByColumn<IPublicPage>('mix_pages', 'seo_url', <string>id)
            .then((res) => ({
              id: res.seo_url,
              seo_title: res.seo_title,
              seo_url: res.seo_url,
              description: res.description,
            })),
      })),
  }),
  withLocalStorage('public-pages'),
);
