import { MixQuery } from '@mixcore/sdk-client';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const databasePageEvents = eventGroup({
  source: 'Database Page',
  events: {
    opened: type<MixQuery>(),
    refreshed: type<MixQuery>(),
  },
});

export const databaseApiEvents = eventGroup({
  source: 'Database API',
  events: {},
});
