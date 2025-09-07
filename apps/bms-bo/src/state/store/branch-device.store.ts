import { inject } from '@angular/core';
import { MixQuery } from '@mixcore/sdk-client';
import { IMMSBranchDevice } from '@mixcore/shared-domain';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { BranchApi } from '../../api-services';
import { StoreDeviceListPageEvent } from '../event/store-device.event';

export const BranchDeviceStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD<IMMSBranchDevice>({
    apiFactory: () => {
      const requestApi = inject(BranchApi);
      return {
        fetchFn: (query: MixQuery) => requestApi.getDevices(query),
        deleteFn: (data) => requestApi.deleteDevice(data as number),
        createFn: (data) => requestApi.createDevice(data as IMMSBranchDevice),
        updateFn: (data) => requestApi.updateDevice(data as IMMSBranchDevice),
      };
    },
    events: {
      fetchDataOn: [
        StoreDeviceListPageEvent.pageOpened,
        StoreDeviceListPageEvent.refreshed,
        StoreDeviceListPageEvent.searched,
      ],
      createDataOn: [StoreDeviceListPageEvent.created],
      deleteDataOn: [StoreDeviceListPageEvent.deleted],
      updateDataOn: [StoreDeviceListPageEvent.updated],
    },
  }),
);
