import { inject } from '@angular/core';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { TicketApiService } from '../../api-service';
import { TicketListPageEvent } from '../events/ticket.event';

export const TicketStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD({
    apiFactory: () => {
      const ticketApiService = inject(TicketApiService);

      return {
        fetchFn: (query) => ticketApiService.getTickets(query),
        updateFn: (data) => ticketApiService.updateTicket(data),
        getByIdFn: (id) => ticketApiService.getTicketById(id as number),
      };
    },
    events: {
      fetchDataOn: [
        TicketListPageEvent.pageOpened,
        TicketListPageEvent.pageRefreshed,
      ],
    },
  }),
);
