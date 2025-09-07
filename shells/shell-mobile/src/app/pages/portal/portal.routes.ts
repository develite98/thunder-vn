import { Route } from '@angular/router';
import { provideMiniAppConfig } from '@mixcore/app-config';
import { appSetting } from '../../../environments/environment';

export const portalRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./portal-outlet/portal-outlet').then(
        (m) => m.PortalOutletComponent,
      ),
    children: [
      {
        path: 'home',
        providers: [
          ...provideMiniAppConfig({
            basePath: 'home',
            appName: 'home',
            appDisplayName: 'Home',
            languages: appSetting.appSetting?.supportedLanguages,
          }),
        ],
        loadChildren: () =>
          import('@mixcore/app/dashboard').then((m) => m.ROUTES),
      },
      {
        path: 'ticket',
        providers: [
          ...provideMiniAppConfig({
            basePath: 'ticket',
            appName: 'ticket',
            appDisplayName: 'ticket',
            languages: appSetting.appSetting?.supportedLanguages,
          }),
        ],
        loadChildren: () =>
          import('@mixcore/app/ticket-m').then((m) => m.ROUTES),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
