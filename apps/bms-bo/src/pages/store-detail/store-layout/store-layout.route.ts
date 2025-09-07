import { Route } from '@angular/router';

export const storeLayoutRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./store-layout.page').then((m) => m.StoreLayoutPage),
    children: [
      {
        path: 'areas',
        loadComponent: () =>
          import('./store-layout-areas/store-layout-areas.page').then(
            (c) => c.StoreTableLayoutAreaPageComponent,
          ),
      },
      {
        path: 'tables',
        loadComponent: () =>
          import('./store-layout-tables/store-layout-tables.page').then(
            (c) => c.StoreLayoutTablesPageComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'ares',
        pathMatch: 'full',
      },
    ],
  },
];
