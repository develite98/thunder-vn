import { MixQuery } from '@mixcore/sdk-client';
import { EventPayload } from '@mixcore/signal';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { IAgency, IBlog, IPage } from '../../types';

export const PageListPageEvent = eventGroup({
  source: 'Pages Page',
  events: {
    create: type<EventPayload<IPage>>(),
    opened: type<MixQuery>(),
    refreshed: type<MixQuery>(),
    updated: type<EventPayload<IAgency>>(),
    deleted: type<EventPayload<number>>(),
  },
});

export const PageDetailPageEvent = eventGroup({
  source: 'Page Detail Page',
  events: {
    opened: type<EventPayload<number>>(),
    updated: type<EventPayload<IPage>>(),
    deleted: type<EventPayload<number>>(),
  },
});

export const PageDialogEvent = eventGroup({
  source: 'Create Page Dialog',
  events: {
    create: type<EventPayload<IPage>>(),
  },
});

export const BlogListPageEvent = eventGroup({
  source: 'Blog Page',
  events: {
    create: type<EventPayload<IBlog>>(),
    opened: type<MixQuery>(),
    refreshed: type<MixQuery>(),
    updated: type<EventPayload<IBlog>>(),
    deleted: type<EventPayload<number>>(),
  },
});

export const BlogDetailPageEvent = eventGroup({
  source: 'Blog Detail Page',
  events: {
    opened: type<EventPayload<number>>(),
    updated: type<EventPayload<IBlog>>(),
    deleted: type<EventPayload<number>>(),
  },
});

export const BlogDialogEvent = eventGroup({
  source: 'Create Blog Dialog',
  events: {
    create: type<EventPayload<IBlog>>(),
  },
});
