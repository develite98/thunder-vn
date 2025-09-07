import { IBrand } from '@mixcore/shared-domain';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { createFromTmsDb } from '../../helpers';

export const BrandStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IBrand>({
    apiFactory: createFromTmsDb('brand-brand'),
  }),
);
