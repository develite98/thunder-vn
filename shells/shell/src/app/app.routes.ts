import { Route } from '@angular/router';
import { appSetting } from '../environments/environment';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: async () => {
      if (appSetting['homePage'] === 'ecom') {
        const m_1 = await import('@mixcore/app/ecommerce');
        return m_1.PublicRoutes;
      } else {
        const m = await import('./pages/public/public.routes');
        return m.publicRoutes;
      }
    },
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./pages/portal/portal.routes').then((m) => m.portalRoutes),
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
  {
    path: '',
    redirectTo: 'app/overview',
    pathMatch: 'full',
  },
];
