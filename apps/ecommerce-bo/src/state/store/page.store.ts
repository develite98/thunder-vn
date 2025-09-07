import { createFromMixDb } from '@mixcore/sdk-client-ng';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { IBlog, IPage } from '../../types';
import {
  BlogDetailPageEvent,
  BlogDialogEvent,
  BlogListPageEvent,
  PageDetailPageEvent,
  PageDialogEvent,
  PageListPageEvent,
} from '../events/page.event';

export const PageStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IPage>({
    apiFactory: createFromMixDb('mix_pages'),
    events: {
      fetchDataOn: [PageListPageEvent.opened, PageListPageEvent.refreshed],
      createDataOn: [PageDialogEvent.create],
      getDataByIdOn: [PageDetailPageEvent.opened],
      deleteDataOn: [PageDetailPageEvent.deleted],
      updateDataOn: [PageDetailPageEvent.updated],
    },
  }),
);

export const BlogStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IBlog>({
    apiFactory: createFromMixDb('mix_blogs'),
    events: {
      fetchDataOn: [BlogListPageEvent.opened, BlogListPageEvent.refreshed],
      createDataOn: [BlogDialogEvent.create],
      getDataByIdOn: [BlogDetailPageEvent.opened],
      deleteDataOn: [BlogDetailPageEvent.deleted],
      updateDataOn: [BlogDetailPageEvent.updated],
    },
  }),
);
