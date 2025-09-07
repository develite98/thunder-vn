import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./settings.page').then((c) => c.SettingPageComponent),
    children: [
      {
        path: 'common',
        loadComponent: () =>
          import('./common-setting/common-setting.page').then(
            (c) => c.CommonSettingPage,
          ),
      },
      {
        path: 'oauth',
        loadComponent: () =>
          import('./auth-provider/auth-provider.page').then(
            (c) => c.AuthProviderPage,
          ),
      },
      {
        path: 'domain',
        loadComponent: () =>
          import('./domain/domain.page').then((c) => c.SysDomainPage),
      },
      {
        path: '',
        redirectTo: 'common',
        pathMatch: 'full',
      },
    ],
  },
];
