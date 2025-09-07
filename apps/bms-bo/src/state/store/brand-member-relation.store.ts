import { inject } from '@angular/core';
import { MixQuery } from '@mixcore/sdk-client';
import { IBranchMemberRelation } from '@mixcore/shared-domain';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { BranchApi } from '../../api-services';
import { StoreMemberListPageEvent } from '../event/store-member.event';

export const BranchMemberStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD<IBranchMemberRelation>({
    apiFactory: () => {
      const requestApi = inject(BranchApi);
      return {
        fetchFn: (query: MixQuery) =>
          requestApi.getBranchMemberRelationships(query),
        deleteFn: (id) => requestApi.deleteBranchMember(id as number),
        createFn: (data) => requestApi.createBranchMember(data),
      };
    },
    events: {
      fetchDataOn: [StoreMemberListPageEvent.pageOpened],
      deleteDataOn: [StoreMemberListPageEvent.memberDeleted],
    },
  }),
);
