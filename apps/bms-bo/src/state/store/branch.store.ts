import { inject } from '@angular/core';
import { ECompareOperator } from '@mixcore/sdk-client';
import { IBmsBranch, IBranch } from '@mixcore/shared-domain';
import { withCRUD } from '@mixcore/signal';
import { signalStore, withMethods } from '@ngrx/signals';
import { BranchApi } from '../../api-services';
import { createFromTmsDb } from '../../helpers';

export const BranchStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD<IBranch>({
    cacheKey: 'branch',
    apiFactory: createFromTmsDb('store-store'),
    filterConfig: [
      {
        fieldName: 'name',
        label: 'Store name',
        type: 'text',
        allowdOperators: [ECompareOperator.Equal, ECompareOperator.Like],
      },
      {
        fieldName: 'code',
        label: 'Store Code',
        allowdOperators: [
          ECompareOperator.Equal,
          ECompareOperator.NotEqual,
          ECompareOperator.Contain,
        ],
        type: 'text',
      },
    ],
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
        updateFn: (data) => requestApi.updateBmsBranch(data),
      };
    },
  }),
  withMethods((store, api = inject(BranchApi)) => ({
    fetchSyncDWH: (branchId: number) => {
      //
    },
  })),
);
