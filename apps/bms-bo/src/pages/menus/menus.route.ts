import { Route } from '@angular/router';

export const menuRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./menus.page').then((m) => m.MenusPageComponent),
    children: [
      {
        path: 'menu-list',
        loadComponent: () =>
          import('./menu-list/menu-list.page').then(
            (m) => m.MenuListPageComponent,
          ),
      },
      {
        path: 'menu-item-list',
        loadComponent: () =>
          import('./menu-item-list/menu-item-list.page').then(
            (m) => m.MenuItemListPageComponent,
          ),
      },

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'menu-list',
      },
    ],
  },
  {
    path: 'menu-item/:id',
    loadComponent: () =>
      import('./menu-item-detail/menu-item-detail.page').then(
        (m) => m.MenuItemDetailPage,
      ),
    children: [
      {
        path: 'config',
        loadComponent: () =>
          import(
            './menu-item-detail/menu-item-configuration/menu-item-configuration.component'
          ).then((m) => m.MenuItemConfigurationPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'config',
      },
    ],
  },
];
