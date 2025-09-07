import { createFromMixDb } from '@mixcore/sdk-client-ng';
import { IBmsUserData } from '@mixcore/shared-domain';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';

export const BmsUserDataStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD<IBmsUserData>({
    apiFactory: createFromMixDb('bms_user_data'),
  }),
);
