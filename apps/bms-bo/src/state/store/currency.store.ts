import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { createFromTmsDb } from '../../helpers';

export const CurrencyStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD<any>({
    apiFactory: createFromTmsDb('currency-currency'),
  }),
);
