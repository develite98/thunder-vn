import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { IAgency } from '../../types';
import { agencyDialogEvent, agencyPageEvent } from '../events/agency.event';

export const AgencyStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IAgency>({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<IAgency>('mix_agency', query),
        getByIdFn: (id) =>
          client.table.getDataById<IAgency>('mix_agency', <string>id),
        deleteFn: (id) => client.table.deleteData('mix_agency', <string>id),
        updateFn: (data) =>
          client.table.updateData<IAgency>('mix_agency', data.id, data),
        createFn: (data) =>
          client.table.createData<IAgency>('mix_agency', data as IAgency),
      })),
    events: {
      fetchDataOn: [agencyPageEvent.opened, agencyPageEvent.refreshed],
      createDataOn: [agencyPageEvent.create, agencyDialogEvent.create],
      updateDataOn: [agencyPageEvent.updated],
      deleteDataOn: [agencyPageEvent.deleted],
    },
  }),
);
