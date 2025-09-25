import { IBranchMember } from '@mixcore/shared-domain';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { createFromTmsDb } from '../../helpers';

export const BranchMemberStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD<IBranchMember>({
    apiFactory: createFromTmsDb('member-member'),
  }),
);
