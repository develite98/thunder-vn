import { IActionCallback, MixColumn, MixTable } from '@mixcore/sdk-client';
import { injectMixClient, withMixClient } from '@mixcore/sdk-client-ng';
import { setEntity, withCRUD } from '@mixcore/signal';
import { signalStore, withMethods } from '@ngrx/signals';
import { catchError, defer, tap } from 'rxjs';

export const TableStore = signalStore(
  { providedIn: 'root' },
  withCRUD<MixTable>({
    apiFactory: () =>
      withMixClient((client) => ({
        getByIdFn: (id: string | number) =>
          client.table.getTableInfoById(id as string),
        createFn: (data: Partial<MixTable>) => client.table.createTable(data),
        updateFn: (data: Partial<MixTable>) => client.table.updateTable(data),
        deleteFn: (id: string | number) =>
          client.table.deleteTable(id as number),
      })),
  }),
  withMethods((store, client = injectMixClient()) => ({
    deleteColumn: (
      tableId: number,
      columnId: number,
      callback?: IActionCallback<MixColumn>,
    ) => {
      return defer(() => client.table.deleteTableColumn(columnId)).pipe(
        tap((r) => {
          const table = store.selectEntityById(tableId)();
          if (table) {
            table.columns = table.columns.filter((c) => c.id !== columnId);
            setEntity(store, table);
          }

          callback?.success?.(r);
        }),
        catchError((err) => {
          callback?.error?.(err);
          throw new Error(err);
        }),
      );
    },
  })),
);
