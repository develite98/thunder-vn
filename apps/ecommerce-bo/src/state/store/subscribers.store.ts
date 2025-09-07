import { createFromMixDb } from '@mixcore/sdk-client-ng';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';

export interface ISubscriber {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  status?: string;
  note?: string;
}

export const SubscriberStore = signalStore(
  { providedIn: 'root' },
  withCRUD<ISubscriber>({
    apiFactory: createFromMixDb('mix_ecom_subscribers'),
  }),
);
