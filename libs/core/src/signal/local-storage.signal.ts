import {
  getState,
  patchState,
  signalStoreFeature,
  withHooks,
} from '@ngrx/signals';
import { inject, effect } from '@angular/core'
import { CacheService } from '@mixcore/cache';

export function withLocalStorage(cacheKey: string) {
  return signalStoreFeature(
    withHooks({
      onInit: (store, cacheSrv = inject(CacheService)) => {
        const cache = cacheSrv.get(cacheKey);
        if (cache) patchState(store, (s) => ({ ...s, ...cache }));

        effect(() => {
          cacheSrv.set(cacheKey, getState(store));
        });
      },
    }),
  );
}
