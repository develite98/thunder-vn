import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./pages/portal/portal.routes').then((m) => m.portalRoutes),
  },
  {
    path: 'demo',
    loadComponent: () =>
      import('./pages/demo/demo.page').then((m) => m.DemoPageComponent),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./pages/error/error.routes').then((m) => m.errorRoutes),
  },
];
