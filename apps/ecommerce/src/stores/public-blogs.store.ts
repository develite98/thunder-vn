import { EMixContentStatus } from '@mixcore/sdk-client';
import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD, withLocalStorage } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';

export interface IPublicBlog {
  id: number;
  title: string;
  seo_title: string;
  excerpt: string;
  created_date_time: string;
  status: EMixContentStatus;
  thumbnail: string;
  seo_url: string;
  description: string;
}

export interface ISocialNetwork {
  id: number;
  display_name: string;
  icon: string;
  link: string;
}

export interface ISubscriber {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  status: string;
}

export const publicBlogStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<IPublicBlog>('mix_blogs', query),
        getByIdFn: (id) =>
          client.table.getDataById<IPublicBlog>('mix_blogs', <string>id),
      })),
  }),
  withLocalStorage('public-blogs'),
);

export const publicBlogDetailStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        getByIdFn: (id) =>
          client.table.getDataById<IPublicBlog>('mix_blogs', <string>id),
      })),
  }),
  withLocalStorage('public-blogs-detail'),
);

export const highlightBlogStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<IPublicBlog>('mix_blogs', query),
        getByIdFn: (id) =>
          client.table.getDataById<IPublicBlog>('mix_blogs', <string>id),
      })),
  }),
  withLocalStorage('public-highlight-blogs'),
);

export const privateBlogStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<IPublicBlog>('mix_blogs', query),
        getByIdFn: (id) =>
          client.table.getDataById<IPublicBlog>('mix_blogs', <string>id),
      })),
  }),
);

export const socialNetworkStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        searchFn: (query) =>
          client.table.filterData<ISocialNetwork>('social_network', query),
      })),
  }),
  withLocalStorage('public-social-networks'),
);

export const subscriberStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        createFn: (data) =>
          client.table.createData<ISubscriber>('mix_ecom_subscribers', data),
      })),
  }),
);
