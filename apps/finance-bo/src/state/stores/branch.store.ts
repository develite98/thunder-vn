import { inject } from '@angular/core';
import { IBranch } from '@mixcore/shared-domain';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { StoreApi } from '../../api-service';

export const BranchStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IBranch>({
    apiFactory: () => {
      const api = inject(StoreApi);
      return {
        fetchFn: () => api.getStores(),
      };
    },
  }),
);
