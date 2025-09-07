import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./app.component').then((c) => c.AppComponent),
    children: [
      {
        path: 'stores',
        loadComponent: () =>
          import('./pages/stores/stores.page').then(
            (c) => c.StoresPageComponent,
          ),
      },
      {
        path: 'menus',
        loadComponent: () =>
          import('./pages/menus/menus.page').then((c) => c.MenusPageComponent),
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./pages/brands/brands.page').then(
            (c) => c.BrandsPageComponent,
          ),
      },
      {
        path: 'stores/:id',
        loadComponent: () =>
          import('./pages/store-detail/store-detail.page').then(
            (c) => c.StoreDetailPageComponent,
          ),
        children: [
          {
            path: 'config',
            loadComponent: () =>
              import(
                './pages/store-detail/store-config/store-config.page'
              ).then((c) => c.StoreConfigPage),
          },
          {
            path: 'members',
            loadComponent: () =>
              import(
                './pages/store-detail/store-members/store-members.page'
              ).then((c) => c.StoreMemberPage),
          },
          {
            path: 'layouts',
            loadChildren: () =>
              import(
                './pages/store-detail/store-layout/store-layout.route'
              ).then((r) => r.storeLayoutRoutes),
          },
          {
            path: 'devices',
            loadComponent: () =>
              import(
                './pages/store-detail/store-devices/store-devices.page'
              ).then((c) => c.StoreDevicesPage),
          },
          {
            path: '',
            redirectTo: 'config',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        redirectTo: 'stores',
        pathMatch: 'full',
      },
    ],
  },
];
