import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./app.component').then((c) => c.AppComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dasboard-overview/dasboard-overview.page').then(
            (c) => c.DashboardOverviewPage,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
];
