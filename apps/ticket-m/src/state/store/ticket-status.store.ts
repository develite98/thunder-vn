import { withMixClient } from '@mixcore/sdk-client-ng';
import { ITicketStatus } from '@mixcore/shared-domain';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { TicketStatusEvent } from '../events/ticket-status.event';

const STATUS_DB_NAME = 'ticket_status';

export const TicketStatusStore = signalStore(
  { providedIn: 'root' },
  withCRUD<ITicketStatus>({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<ITicketStatus>(STATUS_DB_NAME, query),
        getByIdFn: (id) =>
          client.table.getDataById<ITicketStatus>(STATUS_DB_NAME, <string>id),
        deleteFn: (id) => client.table.deleteData(STATUS_DB_NAME, <string>id),
        updateFn: (data) =>
          client.table.updateData<ITicketStatus>(STATUS_DB_NAME, data.id, data),
        createFn: (data) =>
          client.table.createData<ITicketStatus>(
            STATUS_DB_NAME,
            data as ITicketStatus,
          ),
      })),
    events: {
      fetchDataOn: [TicketStatusEvent.pageOpened],
    },
  }),
);
