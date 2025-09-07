import { IMixRole } from '@mixcore/sdk-client';
import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { roleListPageEvent } from '../events/roles.event';

export const RoleStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IMixRole>({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) => client.auth.getSystemRoles(query),
        getByIdFn: (id) => client.auth.getRoleById(<string>id),
        deleteFn: (id) => client.auth.deleteRoleById(<string>id),
        updateFn: (role) => client.auth.updateRoleById(role.id, role),
      })),
    events: {
      fetchDataOn: [roleListPageEvent.opened, roleListPageEvent.refreshed],
    },
  }),
);
