/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapResponse } from '@ngrx/operators';
import {
  getState,
  patchState,
  signalStoreFeature,
  type,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';

import { computed, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { MemoryCache } from '@mixcore/cache';
import { ObjectUtils, StringHelper } from '@mixcore/helper';
import {
  IActionCallback,
  IMixFilter,
  IPaginationResultModel,
  MixQuery,
  PaginationModel,
} from '@mixcore/sdk-client';
import {
  EntityId,
  prependEntity,
  removeEntity,
  setAllEntities,
  upsertEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Events, withEffects, withReducer } from '@ngrx/signals/events';
import { defer, exhaustMap, from, Observable, of, tap } from 'rxjs';
import { StateStatus, withStatus } from './tracking-status.signal';

import objectHash from 'object-hash';

export class DatatState {
  id: string | number;
  state: StateStatus;
  error: string | null;
  isLoading: boolean;
  isSilentLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isPending: boolean;

  constructor(id: string | number, state: StateStatus, error: string | null) {
    this.id = id;
    this.state = state;
    this.error = error;

    this.isLoading = state === StateStatus.Loading;
    this.isSilentLoading = state === StateStatus.SilentLoading;
    this.isSuccess = state === StateStatus.Success;
    this.isError = state === StateStatus.Error;
    this.isPending = state === StateStatus.Pending;
  }
}

const setSuccessEntities = <T>(
  store: any,
  result: IPaginationResultModel<T>,
  query?: MixQuery,
) => {
  patchState(store, (state: any) => {
    const updatedState = setAllEntities([...result.items], {
      collection: 'data',
      selectId: (item: T) => (item as any)['id'],
    })(state);

    return {
      ...updatedState,
      status: StateStatus.Success,
      pagingInfo: new PaginationModel(result.pagingData),
      query: ObjectUtils.clone(query || state.query),
    };
  });
};

export const setEntity = <T>(store: any, result: T) => {
  patchState(store, (state: any) => {
    const updatedState = upsertEntity(result, {
      collection: 'data',
      selectId: (item: T) => (item as any)['id'],
    })(state);

    return {
      ...updatedState,
      status: StateStatus.Success,
    };
  });
};

const deleteEntity = (store: any, result: EntityId) => {
  patchState(store, (state: any) => {
    const updatedState = removeEntity(result, {
      collection: 'data',
    })(state);

    return {
      ...updatedState,
      status: StateStatus.Success,
    };
  });
};

const addEntity = <T>(store: any, result: T) => {
  patchState(store, (state: any) => {
    const updatedState = prependEntity(result, {
      collection: 'data',
      selectId: (item: T) => (item as any)['id'],
    })(state);

    return {
      ...updatedState,
      status: StateStatus.Success,
    };
  });
};

const setErrorEntities = (store: any, error: any) => {
  patchState(store, (state: any) => ({
    ...state,
    status: StateStatus.Error,
    error: error,
  }));
};

const queryToHashKey = (query: MixQuery, key: string) => {
  return (
    key +
    objectHash(query, {
      algorithm: 'sha1',
      encoding: 'hex',
      unorderedObjects: true,
      unorderedArrays: true,
      unorderedSets: true,
    })
  );
};

export type EventCreator = Parameters<InstanceType<typeof Events>['on']>[0];

export type EventPayload<T> = {
  data: T;
  callback?: IActionCallback<T>;
  [key: string]: any;
};

export type FetchEventPayload = {
  query: MixQuery;
  additionalProps?: object;
  callback?: IActionCallback<unknown>;
  [key: string]: any;
};

export function withCRUD<T>(request: {
  cacheKey?: string;
  apiFactory?: () => {
    fetchFn?: (
      query: MixQuery,
      additionalProps?: any,
    ) => Promise<IPaginationResultModel<T>>;
    searchFn?: (
      query: MixQuery,
      additionalProps?: any,
    ) => Promise<IPaginationResultModel<T>>;
    getByIdFn?: (id: string | number, additional?: unknown) => Promise<T>;
    createFn?: (item: T | any, additional?: unknown) => Promise<T>;
    updateFn?: (item: T, additional?: unknown) => Promise<T>;
    deleteFn?: (id: string | number, additional?: unknown) => Promise<T>;
  };
  events?: {
    fetchDataOn?: EventCreator[];
    searchDataOn?: EventCreator[];
    createDataOn?: EventCreator[];
    updateDataOn?: EventCreator[];
    deleteDataOn?: EventCreator[];
    getDataByIdOn?: EventCreator[];
  };
}) {
  return signalStoreFeature(
    withProps(() => {
      const api = request?.apiFactory?.();
      return {
        id: StringHelper.generateUUID(),
        fetchFn: api?.fetchFn || api?.searchFn,
        createFn: api?.createFn,
        updateFn: api?.updateFn,
        deleteFn: api?.deleteFn,
        getByIdFn: api?.getByIdFn,
        cacheKey: request?.cacheKey || StringHelper.generateUUID(),
        fetchDataOn:
          request?.events?.fetchDataOn || request?.events?.searchDataOn,
        createDataOn: request?.events?.createDataOn,
        updateDataOn: request?.events?.updateDataOn,
        deleteDataOn: request?.events?.deleteDataOn,
        getDataByIdOn: request?.events?.getDataByIdOn,
      };
    }),
    withEntities({
      entity: type<T>(),
      collection: 'data',
    }),
    withEntities({
      entity: type<DatatState>(),
      collection: 'data-state',
    }),
    withStatus(),
    withState({
      pagingInfo: PaginationModel.default(),
      query: new MixQuery().default(),
    }),
    withMethods(
      (
        { fetchFn, getByIdFn, cacheKey, ...store },
        router = inject(Router),
        cacheSrv = inject(MemoryCache),
      ) => {
        const setDataLoadingById = (id: string | number) => {
          const entity = store.dataEntityMap()[id];
          const item = !entity
            ? new DatatState(id, StateStatus.Loading, null)
            : new DatatState(id, StateStatus.SilentLoading, null);

          patchState(store, (state: any) => {
            const updatedState = upsertEntity(item, {
              collection: 'data-state',
              selectId: (item) => (item as any)['id'],
            })(state);

            return updatedState;
          });
        };

        const clearCacheAndUpdate = () => {
          cacheSrv.clearAllByPrefix(cacheKey || '');

          const current = getState(store);
          const finalCacheKey = queryToHashKey(current.query, cacheKey);

          cacheSrv.set(finalCacheKey, {
            items: store.dataEntities(),
            pagingData: current.pagingInfo,
          });
        };

        return {
          setDataLoadingById,
          search: (
            query: MixQuery,
            additionalProps?: any,
            callback?: IActionCallback<IPaginationResultModel<T>>,
          ) => {
            if (!fetchFn) throw new Error('fetchFn is not provided');

            patchState(store, () => ({ status: StateStatus.Loading }));

            const finalCacheKey = queryToHashKey(query, cacheKey);
            const cachedData =
              cacheSrv.get<IPaginationResultModel<T>>(finalCacheKey);

            const value = cachedData
              ? of(cachedData)
              : defer(() => fetchFn(query, additionalProps));

            return defer(() => value).pipe(
              mapResponse({
                next: (result) => {
                  callback?.success?.(result);
                  setSuccessEntities(store, result, query);

                  cacheSrv.set(finalCacheKey, result);
                },
                error: (error) => setErrorEntities(store, error),
              }),
            );
          },
          refresh: () => {
            if (!fetchFn) throw new Error('fetchFn is not provided');

            patchState(store, () => ({ status: StateStatus.Loading }));

            const current = getState(store);

            return defer(() => fetchFn(current.query)).pipe(
              mapResponse({
                next: (result) => {
                  setSuccessEntities(store, result, current.query);
                },
                error: (error) => setErrorEntities(store, error),
              }),
            );
          },
          createData: (item: T, callback?: IActionCallback<T>) => {
            if (!store.createFn) throw new Error('createFn is not provided');

            return from(store.createFn(item)).pipe(
              mapResponse({
                next: (result) => {
                  addEntity(store, result);
                  callback?.success?.(result);
                  clearCacheAndUpdate();
                  return result;
                },
                error: (error) => {
                  setErrorEntities(store, error);
                  callback?.error?.(error);
                  return null;
                },
              }),
            );
          },
          updateData: (item: T, callback?: IActionCallback<T>) => {
            if (!store.updateFn) throw new Error('createFn is not provided');

            return from(store.updateFn(item)).pipe(
              mapResponse({
                next: (result) => {
                  setEntity(store, result);
                  clearCacheAndUpdate();
                  callback?.success?.(result);
                },
                error: (error) => {
                  setErrorEntities(store, error);
                  clearCacheAndUpdate();
                  callback?.error?.(error);
                },
              }),
            );
          },
          filter: (filter: IMixFilter[]) => {
            router.navigate([], {
              queryParams: { query: MixQuery.toShortQueryParams(filter) },
              queryParamsHandling: 'merge',
            });
          },
          deleteDataById: (
            id: string | number,
            callback?: IActionCallback<T>,
          ) => {
            if (!store.deleteFn) throw new Error('createFn is not provided');

            return from(store.deleteFn(id)).pipe(
              mapResponse({
                next: (result) => {
                  deleteEntity(store, id);
                  clearCacheAndUpdate();
                  callback?.success?.(result);
                },
                error: (error) => {
                  setErrorEntities(store, error);
                  callback?.error?.(error);
                },
              }),
            );
          },
          getById: (id: string | number) => {
            if (!getByIdFn) {
              throw new Error('getByIdFn is not provided');
            }

            setDataLoadingById(id);

            return from(getByIdFn(id)).pipe(
              mapResponse({
                next: (result) => {
                  setEntity(store, result);

                  const item = new DatatState(id, StateStatus.Success, null);
                  patchState(store, (state: any) => {
                    const updatedState = upsertEntity(item, {
                      collection: 'data-state',
                      selectId: (item) => (item as any)['id'],
                    })(state);

                    return updatedState;
                  });
                  return result;
                },
                error: (error) => {
                  setErrorEntities(store, error);
                  patchState(store, (state: any) => {
                    const updatedState = upsertEntity(
                      new DatatState(id, StateStatus.Error, error as string),
                      {
                        collection: 'data-state',
                        selectId: (item) => (item as any)['id'],
                      },
                    )(state);

                    return updatedState;
                  });

                  return null;
                },
              }),
            );
          },
          goNextPage: () => {
            if (!fetchFn) throw new Error('fetchFn is not provided');

            if (!store.pagingInfo()?.canGoNext) return from(Promise.resolve());

            const current = getState(store);
            current.query.pageIndex = (current.pagingInfo.pageIndex || 0) + 1;
            current.pagingInfo.pageIndex += 1;

            patchState(store, () => ({
              ...current,
              query: ObjectUtils.clone(current.query),
              status: StateStatus.Loading,
            }));

            return from(fetchFn(current.query))
              .pipe(
                mapResponse({
                  next: (result) =>
                    setSuccessEntities(store, result, current.query),
                  error: (error) => setErrorEntities(store, error),
                }),
              )
              .subscribe();
          },
          goPreviousPage: () => {
            if (!fetchFn) throw new Error('fetchFn is not provided');

            if (!store.pagingInfo().canGoPrevious)
              return from(Promise.resolve());

            const current = getState(store);
            current.query.pageIndex = (current.pagingInfo.pageIndex || 0) - 1;
            current.pagingInfo.pageIndex -= 1;

            patchState(store, () => ({
              ...current,
              query: ObjectUtils.clone(current.query),
              status: StateStatus.Loading,
            }));

            return from(fetchFn(current.query))
              .pipe(
                mapResponse({
                  next: (result) =>
                    setSuccessEntities(store, result, current.query),
                  error: (error) => setErrorEntities(store, error),
                }),
              )
              .subscribe();
          },
          goNextPageRouter: () => {
            if (!fetchFn) throw new Error('fetchFn is not provided');

            const current = getState(store);

            const pageIndex = current.query.pageIndex || 0;
            const totalPage = current.pagingInfo?.totalPage || 0;
            if (pageIndex >= totalPage - 1) return;

            current.query.pageIndex = (current.pagingInfo.pageIndex || 0) + 1;
            current.pagingInfo.pageIndex += 1;

            patchState(store, () => ({
              ...current,
              query: ObjectUtils.clone(current.query),
            }));

            router.navigate([], {
              queryParams: { pageIndex: current.query.pageIndex },
              queryParamsHandling: 'merge',
            });
          },
          searchRouter: (keyword: string | undefined | null) => {
            if (keyword === undefined || keyword === null) return;

            router.navigate([], {
              queryParams: { keyword },
              queryParamsHandling: 'merge',
            });
          },
          goToPageRouter: (pageIndex: number) => {
            if (!fetchFn) throw new Error('fetchFn is not provided');

            const current = getState(store);

            current.query.pageIndex = pageIndex;
            current.pagingInfo.pageIndex = pageIndex;

            patchState(store, () => ({
              ...current,
              query: ObjectUtils.clone(current.query),
            }));

            router.navigate([], {
              queryParams: { pageIndex: current.query.pageIndex },
              queryParamsHandling: 'merge',
            });
          },
          goPreviousPageRouter: () => {
            if (!fetchFn) throw new Error('fetchFn is not provided');

            const current = getState(store);
            if (current.query.pageIndex === 0) return;

            current.query.pageIndex = (current.pagingInfo.pageIndex || 0) - 1;
            current.pagingInfo.pageIndex -= 1;

            patchState(store, () => ({
              ...current,
              query: ObjectUtils.clone(current.query),
            }));

            router.navigate([], {
              queryParams: { pageIndex: current.query.pageIndex },
              queryParamsHandling: 'merge',
            });
          },
          selectEntityById: (
            id:
              | Signal<string | number | undefined | null>
              | string
              | number
              | undefined
              | null,
            callback?: (data: T) => void,
          ) =>
            computed(() => {
              let entityId: string | number | undefined | null;
              if (typeof id === 'string' || typeof id === 'number') {
                entityId = id;
              } else {
                entityId = id?.();
              }

              if (!entityId) return null;

              const entities = store.dataEntityMap();
              const entity = entities[entityId];

              if (!entity) return null;

              const value = ObjectUtils.clone(entity);
              callback?.(value);
              return value;
            }),
          selectEntityByField: (
            id:
              | Signal<string | number | undefined | null>
              | string
              | number
              | undefined
              | null,
            field: string,
            callback?: (data: T) => void,
          ) =>
            computed(() => {
              let entityId: string | number | undefined | null;
              if (typeof id === 'string' || typeof id === 'number') {
                entityId = id;
              } else {
                entityId = id?.();
              }

              if (!entityId) return null;

              const entities = store.dataEntities();
              const entity = entities.find(
                (e) => (e as any)[field]?.toString() === entityId.toString(),
              );

              if (!entity) return null;

              const value = ObjectUtils.clone(entity);
              callback?.(value);
              return value;
            }),
          selectEntityStateById: (
            id:
              | Signal<string | number | undefined | null>
              | string
              | number
              | undefined
              | null,
          ) =>
            computed(() => {
              let entityId: string | number | undefined | null;
              if (typeof id === 'string' || typeof id === 'number') {
                entityId = id;
              } else {
                entityId = id?.();
              }

              if (!entityId) return null;

              const entities = store['data-stateEntityMap']();
              return entities[entityId];
            }),
        };
      },
    ),
    withEffects((_store, events = inject(Events)) => {
      const store = _store;
      const effect = {} as Record<string, Observable<unknown>>;

      const fetchDataOn = store.fetchDataOn;
      if (fetchDataOn) {
        effect['search$'] = events.on(...fetchDataOn).pipe(
          tap(() => patchState(store, () => ({ status: StateStatus.Loading }))),
          exhaustMap((value) => {
            const searchFn = store.search;
            return value.payload?.query
              ? searchFn(value.payload.query, value.payload.additionalProps)
              : searchFn(value.payload);
          }),
        );
      }

      const createDataOn = store.createDataOn;
      if (createDataOn) {
        effect['createData$'] = events.on(...createDataOn).pipe(
          tap(() => patchState(store, () => ({ status: StateStatus.Adding }))),
          exhaustMap((value) =>
            store.createData(value.payload.data, value.payload.callback),
          ),
        );
      }

      const updateDataOn = store.updateDataOn;
      if (updateDataOn) {
        effect['updateData$'] = events.on(...updateDataOn).pipe(
          tap(() =>
            patchState(store, () => ({ status: StateStatus.Updatting })),
          ),
          exhaustMap((value) =>
            store.updateData(value.payload.data, value.payload.callback),
          ),
        );
      }

      const deleteDataOn = store.deleteDataOn;
      if (deleteDataOn) {
        effect['deleteData$'] = events.on(...deleteDataOn).pipe(
          tap(() =>
            patchState(store, () => ({ status: StateStatus.Deleting })),
          ),
          exhaustMap((value) =>
            store.deleteDataById(value.payload.data, value.payload.callback),
          ),
        );
      }

      const getDataByIdOn = store.getDataByIdOn;
      if (getDataByIdOn) {
        effect['getDataById$'] = events
          .on(...getDataByIdOn)
          .pipe(exhaustMap((value) => store.getById(value.payload.data)));
      }

      return effect;
    }),
    withReducer(),
  );
}
