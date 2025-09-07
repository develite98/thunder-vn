import { IBranchArea, IBranchTable } from '@mixcore/shared-domain';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { createFromTmsDb } from '../../helpers';

export const BranchAreaStore = signalStore(
  withCRUD<IBranchArea>({
    apiFactory: createFromTmsDb('area-area'),
  }),
);

export const BranchTableStore = signalStore(
  withCRUD<IBranchTable>({
    apiFactory: createFromTmsDb('table-table'),
  }),
);
