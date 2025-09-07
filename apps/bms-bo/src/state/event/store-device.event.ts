import { MixQuery } from '@mixcore/sdk-client';
import { IMMSBranchDevice } from '@mixcore/shared-domain';
import { EventPayload, FetchEventPayload } from '@mixcore/signal';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const StoreDeviceListPageEvent = eventGroup({
  source: 'Store Device List Page',
  events: {
    pageOpened: type<MixQuery>(),
    refreshed: type<FetchEventPayload>(),
    searched: type<MixQuery>(),
    created: type<EventPayload<Partial<IMMSBranchDevice>>>(),
    updated: type<EventPayload<Partial<IMMSBranchDevice>>>(),
    deleted: type<EventPayload<number>>(),
  },
});
