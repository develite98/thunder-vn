import { EventPayload, FetchEventPayload } from '@mixcore/signal';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const StoreMemberListPageEvent = eventGroup({
  source: 'Store Members List Page',
  events: {
    pageOpened: type<FetchEventPayload>(),
    refreshed: type<FetchEventPayload>(),
    memberDeleted: type<EventPayload<number>>(),
  },
});
