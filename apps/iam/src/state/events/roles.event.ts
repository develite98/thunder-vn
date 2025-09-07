import { IMixRole, MixQuery } from '@mixcore/sdk-client';
import { EventPayload } from '@mixcore/signal';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const roleListPageEvent = eventGroup({
  source: 'Role List Page',
  events: {
    opened: type<MixQuery>(),
    refreshed: type<MixQuery>(),
    updated: type<EventPayload<IMixRole>>(),
    deleted: type<EventPayload<string>>(),
  },
});
