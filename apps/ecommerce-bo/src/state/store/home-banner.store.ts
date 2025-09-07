import { MixQuery } from '@mixcore/sdk-client';
import { createFromMixDb } from '@mixcore/sdk-client-ng';
import { EventPayload, withCRUD } from '@mixcore/signal';
import { signalStore, type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { IHomeBanner, ISocialNetwork } from '../../types';

export const HomeBannerListPageEvent = eventGroup({
  source: 'Home Banner List Page',
  events: {
    create: type<EventPayload<IHomeBanner>>(),
    opened: type<MixQuery>(),
    refreshed: type<MixQuery>(),
    updated: type<EventPayload<IHomeBanner>>(),
    deleted: type<EventPayload<number>>(),
  },
});

export const HomeBannerStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IHomeBanner>({
    apiFactory: createFromMixDb('mix_ecom_home_banner'),
    events: {
      searchDataOn: [
        HomeBannerListPageEvent.opened,
        HomeBannerListPageEvent.refreshed,
      ],
      createDataOn: [HomeBannerListPageEvent.create],
      deleteDataOn: [HomeBannerListPageEvent.deleted],
      updateDataOn: [HomeBannerListPageEvent.updated],
    },
  }),
);

export const SocialNetworkStore = signalStore(
  { providedIn: 'root' },
  withCRUD<ISocialNetwork>({
    apiFactory: createFromMixDb('social_network'),
  }),
);
