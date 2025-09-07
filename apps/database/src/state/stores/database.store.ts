import { computed, Signal } from '@angular/core';
import { MixDatabase, MixQuery, MixTable } from '@mixcore/sdk-client';
import { withMixClient } from '@mixcore/sdk-client-ng';

import { signalStore, withComputed, withMethods } from '@ngrx/signals';

import { ObjectUtils } from '@mixcore/helper';
import { withCRUD } from '@mixcore/signal';
import { databasePageEvents } from '../events';

export const DatabaseStore = signalStore(
  { providedIn: 'root' },
  withCRUD<MixDatabase>({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query: MixQuery) => client.database.getDatabases(query),
      })),
    events: {
      fetchDataOn: [databasePageEvents.opened, databasePageEvents.refreshed],
    },
  }),
  withComputed((store) => ({
    tables: computed(() => {
      return store
        .dataEntities()
        .map((d) => d.databases)
        .filter(Boolean)
        .flat() as MixTable[];
    }),
  })),
  withMethods((store) => ({
    getTableById: (idSignal: Signal<string | undefined | null>) =>
      computed(() => {
        const id = idSignal();
        if (!id) return null;

        const table = store.tables().find((t) => t.id === parseInt(id));
        return table ? ObjectUtils.clone(table) : null;
      }),
  })),
);
