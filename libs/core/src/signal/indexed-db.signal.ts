import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
  withProps,
} from '@ngrx/signals';
import {
  prependEntity,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { Dexie } from 'dexie';
import { StateStatus } from './tracking-status.signal';

export const indexedDbSignal = <T>(config: {
  dbName: string;
  attribute: string;
}) => {
  const db = new Dexie(config.dbName);
  db.version(1).stores({
    data: config.attribute.replace(/, /g, ','),
  });

  return signalStoreFeature(
    withProps(() => ({
      table: db.table<T, number>('data'),
    })),
    withEntities({
      entity: type<T>(),
      collection: 'data',
    }),
    withMethods((store) => ({
      addData: (data: T) => {
        patchState(store, (state) => {
          const updatedState = prependEntity(data, {
            collection: 'data',
            selectId: (item: T) => (item as any)['id'],
          })(state);

          return {
            ...updatedState,
          };
        });

        db.transaction('rw', db.table('data'), function () {
          db.table('data')
            .add(data)
            .then<void, T>((d) => {
              console.log(d);
            });
        }).catch(function (e) {
          console.error(e.stack);
        });
      },
      removeData: (id: number | string) => {
        patchState(store, (state) => {
          const updatedState = setAllEntities(
            store.dataEntities().filter((x) => (x as any)['id'] !== id),
            {
              collection: 'data',
              selectId: (item: T) => (item as any)['id'],
            },
          )(state);

          return {
            ...updatedState,
          };
        });

        db.transaction('rw', db.table('data'), function () {
          db.table('data').delete(id);
        }).catch(function (e) {
          console.error(e.stack);
        });
      },
      search: () => {
        db.table('data')
          .limit(10)
          .toArray()
          .then((items) => {
            patchState(store, (state: any) => {
              const updatedState = setAllEntities([...items], {
                collection: 'data',
                selectId: (item: T) => (item as any)['id'],
              })(state);

              return {
                ...updatedState,
                status: StateStatus.Success,
              };
            });
          });
      },
    })),
  );
};
