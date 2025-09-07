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
        path: 'overview',
        providers: [
          ...provideMiniAppConfig({
            basePath: 'overvview',
            appName: 'system-dashboard',
            appDisplayName: 'System Dashboard',
            languages: appSetting.appSetting?.supportedLanguages,
          }),
        ],
        loadChildren: () =>
          import('@mixcore/app/dashboard').then((m) => m.ROUTES),
      },
      {
        path: 'db',
        providers: [
          ...provideMiniAppConfig({
            basePath: 'db',
            appName: 'database',
            appDisplayName: 'Database',
            languages: appSetting.appSetting?.supportedLanguages,
          }),
        ],
        loadChildren: () =>
          import('@mixcore/app/database').then((m) => m.ROUTES),
      },
      {
        path: 'iam',
        providers: [
          ...provideMiniAppConfig({
            basePath: 'iam',
            appName: 'iam',
            appDisplayName: 'Identity and Access Management',
            languages: appSetting.appSetting?.supportedLanguages,
          }),
        ],
        loadChildren: () => import('@mixcore/app/iam').then((m) => m.ROUTES),
      },
      {
        path: 'e-com',
        providers: [
          ...provideMiniAppConfig({
            basePath: 'e-com',
            appName: 'ecommerce',
            appDisplayName: 'E-Commerce',
            languages: appSetting.appSetting?.supportedLanguages,
          }),
        ],
        loadChildren: () =>
          import('@mixcore/app/ecommerce-bo').then((m) => m.ROUTES),
      },
      {
        path: 'finance',
        providers: [
          ...provideMiniAppConfig({
            basePath: 'finance',
            appName: 'finance',
            appDisplayName: 'Finance',
            languages: appSetting.appSetting?.supportedLanguages,
          }),
        ],
        loadChildren: () =>
          import('@mixcore/app/finance').then((m) => m.ROUTES),
      },
      {
        path: 'ai',
        providers: [
          ...provideMiniAppConfig({
            basePath: 'ai',
            appName: 'aias',
            appDisplayName: 'AI Asistant',
            languages: appSetting.appSetting?.supportedLanguages,
          }),
        ],
        loadChildren: () => import('@mixcore/app/aias').then((m) => m.ROUTES),
      },
      {
        path: 'bms',
        providers: [
          ...provideMiniAppConfig({
            basePath: 'bms',
            appName: 'bms',
            appDisplayName: 'Branding System',
            languages: appSetting.appSetting?.supportedLanguages,
          }),
        ],
        loadChildren: () => import('@mixcore/app/bms').then((m) => m.ROUTES),
      },
      {
        path: 'setting',
        providers: [
          ...provideMiniAppConfig({
            basePath: 'setting',
            appName: 'sys',
            appDisplayName: 'System Configuratoin',
            languages: appSetting.appSetting?.supportedLanguages,
          }),
        ],
        loadChildren: () => import('@mixcore/app/sys').then((m) => m.ROUTES),
      },
    ],
  },
];
