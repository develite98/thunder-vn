import { IRegisterAccountRequest, IUser, MixQuery } from '@mixcore/sdk-client';
import { EventPayload } from '@mixcore/signal';
import { type } from '@ngrx/signals';
import { eventGroup, injectDispatch } from '@ngrx/signals/events';

export const userPageEvent = eventGroup({
  source: 'Users Page',
  events: {
    opened: type<MixQuery>(),
    refreshed: type<MixQuery>(),
  },
});

export const userDetailPage = eventGroup({
  source: 'User Detail Page',
  events: {
    pageOpened: type<EventPayload<string>>(),
    updated: type<EventPayload<IUser>>(),
    deleted: type<EventPayload<string>>(),
  },
});

export const userDialogEvent = eventGroup({
  source: 'Create User Dialog',
  events: {
    create: type<EventPayload<IRegisterAccountRequest>>(),
  },
});

export const injectUserPageEvent = () => {
  return injectDispatch(userPageEvent);
};
