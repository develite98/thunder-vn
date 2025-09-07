import { MixQuery } from '@mixcore/sdk-client';
import { EventPayload, FetchEventPayload } from '@mixcore/signal';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const StoreListPageEvent = eventGroup({
  source: 'Store List Page',
  events: {
    pageOpened: type<MixQuery>(),
    refreshed: type<FetchEventPayload>(),
    searched: type<MixQuery>(),
  },
});

export const StoreDetailPageEvent = eventGroup({
  source: 'Store Detail Page',
  events: {
    pageOpened: type<EventPayload<number>>(),
  },
});
