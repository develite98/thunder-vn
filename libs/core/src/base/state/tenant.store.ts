import { computed, inject } from '@angular/core';
import { injectAppConfig, ITenant } from '@mixcore/app-config';
import { withLocalStorage } from '@mixcore/signal';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';

export const AppTenantStore = signalStore(
  { providedIn: 'root' },
  withProps((store, appConfig = injectAppConfig()) => ({
    availableTenants: appConfig.tenants,
    canChooseTenant: (appConfig.tenants?.length || 0) > 1,
  })),
  withState({
    tenant: <ITenant | null>null,
  }),
  withComputed((store) => ({
    selectedTenant: computed(() => {
      return (
        store.availableTenants?.find((x) => x.id === store.tenant()?.id) || null
      );
    }),
  })),
  withMethods((store) => ({
    setSelectedTenant(tenant: ITenant | null, removeTokens = true) {
      if (removeTokens) {
        localStorage.removeItem('mix_access_token');
        localStorage.removeItem('mix_refresh_token');
        localStorage.removeItem('__MIX_CACHE_STORAGE__');
      }

      patchState(store, {
        tenant: tenant,
      });
    },
  })),
  withLocalStorage('mix-tenant'),
  withHooks((store) => ({
    onInit() {
      if (store.availableTenants?.length === 1) {
        store.setSelectedTenant(store.availableTenants[0], false);
      }
    },
  })),
);

export const injectTenant = () => {
  return inject(AppTenantStore);
};
