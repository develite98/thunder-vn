import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./app.component').then((c) => c.AppComponent),
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('./pages/ticket-list/ticket-list.page').then(
            (c) => c.TicketListPage,
          ),
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('./pages/ticket-detail/ticket-detail.page').then(
            (c) => c.TicketDetailPage,
          ),
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
];
