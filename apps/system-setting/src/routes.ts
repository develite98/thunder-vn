import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./app.component').then((c) => c.AppComponent),
    children: [
      {
        path: 's',
        loadChildren: () =>
          import('./pages/settings/settings.route').then((m) => m.ROUTES),
      },
      {
        path: '',
        redirectTo: 's',
        pathMatch: 'full',
      },
    ],
  },
];
