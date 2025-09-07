import { FetchEventPayload } from '@mixcore/signal';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const requestPageEvent = eventGroup({
  source: 'Request Page',
  events: {
    opened: type<FetchEventPayload>(),
  },
});
