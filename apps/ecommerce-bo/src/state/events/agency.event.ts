import { IRegisterAccountRequest, MixQuery } from '@mixcore/sdk-client';
import { EventPayload } from '@mixcore/signal';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { IAgency } from '../../types';

export const agencyPageEvent = eventGroup({
  source: 'Agency Page',
  events: {
    create: type<EventPayload<IRegisterAccountRequest>>(),
    opened: type<MixQuery>(),
    refreshed: type<MixQuery>(),
    updated: type<EventPayload<IAgency>>(),
    deleted: type<EventPayload<number>>(),
  },
});

export const agencyDialogEvent = eventGroup({
  source: 'Create Agency Dialog',
  events: {
    create: type<EventPayload<IAgency>>(),
  },
});
