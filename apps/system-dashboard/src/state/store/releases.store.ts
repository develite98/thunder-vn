import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppTenantStore } from '@mixcore/base';
import { IPaginationResultModel } from '@mixcore/sdk-client';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { lastValueFrom, map } from 'rxjs';
import { IRelease } from '../../types';
import { IContributor } from '../../types/contributor.type';

export const AppReleaseStore = signalStore(
  withCRUD<IRelease>({
    apiFactory: () => {
      const http = inject(HttpClient);
      const tenant = inject(AppTenantStore);
      const releaseUrl = tenant.selectedTenant()?.gitHubApiUrl + '/releases';

      return {
        fetchFn: () =>
          lastValueFrom(
            http.get<IRelease[]>(releaseUrl).pipe(
              map(
                (result) =>
                  <IPaginationResultModel<IRelease>>{
                    items: result,
                    pagingData: {
                      total: result.length,
                    },
                  },
              ),
            ),
          ),
      };
    },
  }),
);

export const AppContributorStore = signalStore(
  withCRUD<IContributor>({
    apiFactory: () => {
      const http = inject(HttpClient);
      const tenant = inject(AppTenantStore);
      const releaseUrl =
        tenant.selectedTenant()?.gitHubApiUrl + '/contributors';

      return {
        fetchFn: () =>
          lastValueFrom(
            http.get<IContributor[]>(releaseUrl).pipe(
              map(
                (result) =>
                  <IPaginationResultModel<IContributor>>{
                    items: result,
                    pagingData: {
                      total: result.length,
                    },
                  },
              ),
            ),
          ),
      };
    },
  }),
);
