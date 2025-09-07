import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { ISubscriber } from '../../types';
import { subscriberPageEvent } from '../events/subscriber.event';

export const SubscriberStore = signalStore(
  { providedIn: 'root' },
  withCRUD<ISubscriber>({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<ISubscriber>('mix_ecom_subscribers', query),
        getByIdFn: (id) =>
          client.table.getDataById<ISubscriber>(
            'mix_ecom_subscribers',
            <string>id,
          ),
        deleteFn: (id) =>
          client.table.deleteData('mix_ecom_subscribers', <string>id),
        updateFn: (data) =>
          client.table.updateData<ISubscriber>(
            'mix_ecom_subscribers',
            data.id,
            data,
          ),
        createFn: (data) =>
          client.table.createData<ISubscriber>(
            'mix_ecom_subscribers',
            data as ISubscriber,
          ),
      })),
    events: {
      fetchDataOn: [subscriberPageEvent.opened, subscriberPageEvent.refreshed],
      createDataOn: [subscriberPageEvent.create, subscriberPageEvent.create],
      updateDataOn: [subscriberPageEvent.updated],
    },
  }),
);
