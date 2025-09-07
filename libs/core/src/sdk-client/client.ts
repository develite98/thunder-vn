import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { injectAppConfig } from '@mixcore/app-config';
import { AppTenantStore } from '@mixcore/base';
import {
  MixcoreAuth,
  MixcoreClient,
  MixcoreDatabase,
  MixcoreSetting,
  MixcoreStorage,
  MixcoreTable,
  MixQuery,
} from '@mixcore/sdk-client';
import { AxiosInstance } from 'axios';

let mixcoreClient: MixcoreClient;
let mixcoreDatabase: MixcoreDatabase;
let mixcoreStorage: MixcoreStorage;
let mixcoreAuth: MixcoreAuth;
let mixcoreTable: MixcoreTable;
let api: AxiosInstance;
let setting: MixcoreSetting;

export const injectMixClient = () => {
  const appConfig = injectAppConfig();
  const router = inject(Router);
  const tenant = inject(AppTenantStore);

  if (!mixcoreClient) {
    mixcoreClient = new MixcoreClient({
      endpoint: tenant.selectedTenant()?.domain || appConfig.apiUrl,
      unAuthorizedCallback: () => {
        router.navigate(['/auth/login']);
      },
    });

    mixcoreDatabase = new MixcoreDatabase(mixcoreClient);
    mixcoreStorage = new MixcoreStorage(mixcoreClient);
    mixcoreAuth = new MixcoreAuth(mixcoreClient);
    mixcoreTable = new MixcoreTable(mixcoreClient);
    api = mixcoreClient.api;
    setting = mixcoreClient.setting;
  }

  return {
    client: mixcoreClient,
    database: mixcoreDatabase,
    storage: mixcoreStorage,
    auth: mixcoreAuth,
    table: mixcoreTable,
    api: api,
    hub: mixcoreClient.hub,
    setting: setting,
  };
};

export function withMixClient<T>(
  fn: (client: ReturnType<typeof injectMixClient>) => T,
): T {
  const client = injectMixClient();
  return fn(client);
}

export function withMixCRUD<T>(
  fn: (client: ReturnType<typeof injectMixClient>) => T,
): T {
  const client = injectMixClient();
  return fn(client);
}

export function createFromMixDb<T>(DB_NAME: string) {
  return () => {
    const client = injectMixClient();

    return {
      fetchFn: (query: MixQuery) => client.table.filterData<T>(DB_NAME, query),
      getByIdFn: (id: number | string) =>
        client.table.getDataById<T>(DB_NAME, <string>id),
      deleteFn: (id: number | string) =>
        client.table.deleteData<T>(DB_NAME, <string>id),
      createFn: (data: Partial<T>) => client.table.createData<T>(DB_NAME, data),
      updateFn: (data: Partial<T>) =>
        client.table.updateData<T>(DB_NAME, (data as any)['id'], data),
    };
  };
}
