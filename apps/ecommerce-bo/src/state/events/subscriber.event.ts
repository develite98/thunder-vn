import { MixQuery } from '@mixcore/sdk-client';
import { EventPayload } from '@mixcore/signal';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { ISubscriber } from '../../types';

export const subscriberPageEvent = eventGroup({
  source: 'Subscriber Page',
  events: {
    create: type<EventPayload<ISubscriber>>(),
    opened: type<MixQuery>(),
    refreshed: type<MixQuery>(),
    updated: type<EventPayload<ISubscriber>>(),
    deleted: type<EventPayload<number>>(),
  },
});
