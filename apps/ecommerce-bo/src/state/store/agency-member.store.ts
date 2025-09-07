import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { IAgencyMember } from '../../types';

export const AgencyMemberStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IAgencyMember>({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<IAgencyMember>('agency_member', query),
        getByIdFn: (id) =>
          client.table.getDataById<IAgencyMember>('agency_member', <string>id),
        deleteFn: (id) => client.table.deleteData('agency_member', <string>id),
        updateFn: (data) =>
          client.table.updateData<IAgencyMember>(
            'agency_member',
            data.id,
            data,
          ),
        createFn: (data) =>
          client.table.createData<IAgencyMember>(
            'agency_member',
            data as IAgencyMember,
          ),
      })),
  }),
);
