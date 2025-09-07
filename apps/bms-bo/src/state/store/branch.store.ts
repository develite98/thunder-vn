import { inject } from '@angular/core';
import { IBmsBranch, IBranch } from '@mixcore/shared-domain';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { BranchApi } from '../../api-services';
import { createFromTmsDb } from '../../helpers';
import { StoreDetailPageEvent, StoreListPageEvent } from '../event/store.event';

export const BranchStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD<IBranch>({
    cacheKey: 'branch',
    apiFactory: createFromTmsDb('store-store'),
    events: {
      fetchDataOn: [
        StoreListPageEvent.pageOpened,
        StoreListPageEvent.refreshed,
        StoreListPageEvent.searched,
      ],
      getDataByIdOn: [StoreDetailPageEvent.pageOpened],
    },
  }),
);

export const BmsBranchStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD<IBmsBranch>({
    apiFactory: () => {
      const requestApi = inject(BranchApi);
      return {
        getByIdFn: (id) => requestApi.getBmsBranchById(id as number),
        createFn: (data) => requestApi.createBmsBranchByOriginId(data),
      };
    },
  }),
);
