import { MixQuery } from '@mixcore/sdk-client';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const TicketListPageEvent = eventGroup({
  source: 'Ticket List Page',
  events: {
    pageOpened: type<MixQuery>(),
    pageRefreshed: type<MixQuery>(),
  },
});

export const TicketDetailPageEvent = eventGroup({
  source: 'Ticket Detail Page',
  events: {
    pageOpened: type<MixQuery>(),
  },
});
