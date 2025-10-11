import { MixQuery } from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';

export class DocumentQuery extends MixQuery {
  tableSystemName?: string;
}

function parseDbString(str: string) {
  const parts = str.split('-');
  const id = parts.pop();
  const dbSystemName = parts.join('-');
  return { dbSystemName, id };
}

export const TableDocumentStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD<unknown>({
    apiFactory: () => {
      const api = injectMixClient();

      return {
        searchFn: (query: DocumentQuery) =>
          api.table.filterData(query.tableSystemName || '', query),
        getByIdFn: (value) => {
          const { dbSystemName, id } = parseDbString(value!.toString());
          return api.table.getDataById(dbSystemName, id!);
        },
        createFn: (data) => {
          const { dbSystemName, id, ...rest } = data as any;
          return api.table.createData(dbSystemName, rest);
        },
      };
    },
  }),
);
