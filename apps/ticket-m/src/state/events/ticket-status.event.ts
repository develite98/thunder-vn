import { MixQuery } from '@mixcore/sdk-client';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const TicketStatusEvent = eventGroup({
  source: 'Tickets Module',
  events: {
    pageOpened: type<MixQuery>(),
  },
});
