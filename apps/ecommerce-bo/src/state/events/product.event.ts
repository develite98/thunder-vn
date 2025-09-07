import { MixQuery } from '@mixcore/sdk-client';
import { EventPayload } from '@mixcore/signal';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { IProduct, IProductCategory } from '../../types';

export const productPageEvent = eventGroup({
  source: 'Product Page',
  events: {
    create: type<EventPayload<IProduct>>(),
    opened: type<MixQuery>(),
    searched: type<MixQuery>(),
    refreshed: type<MixQuery>(),
    updated: type<EventPayload<IProduct>>(),
    deleted: type<EventPayload<number>>(),
  },
});

export const productDetailPageEvent = eventGroup({
  source: 'Product Detail Page',
  events: {
    pageOpened: type<EventPayload<number | string>>(),
    updated: type<EventPayload<IProduct>>(),
    deleted: type<EventPayload<number>>(),
  },
});

export const productCategoryPageEvent = eventGroup({
  source: 'Product Categpru Page',
  events: {
    create: type<EventPayload<IProductCategory>>(),
    opened: type<MixQuery>(),
    refreshed: type<MixQuery>(),
    updated: type<EventPayload<IProductCategory>>(),
    deleted: type<EventPayload<number>>(),
  },
});

export const productDialogEvent = eventGroup({
  source: 'Create Product Dialog',
  events: {
    create: type<EventPayload<IProduct>>(),
  },
});
