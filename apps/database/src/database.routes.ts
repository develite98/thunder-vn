import { Route } from '@angular/router';
import { roleGuard } from 'libs/core/src/permissions';

export const ROUTES: Route[] = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: ['SuperAdmin'] },
    loadComponent: () =>
      import('./pages/databases/databases.page').then(
        (m) => m.DatabasesPageComponent,
      ),
  },
  {
    path: ':databaseId/table/detail/:tableId',
    canActivate: [roleGuard],
    data: { roles: ['SuperAdmin'] },
    loadComponent: () =>
      import('./pages/table-detail/table-detail.page').then(
        (m) => m.TableDetailPageComponent,
      ),
    children: [
      {
        path: 'columns',
        loadComponent: () =>
          import('./pages/table-detail/table-columns/table-columns.page').then(
            (m) => m.TableColumnsPage,
          ),
      },
      {
        path: 'config',
        loadComponent: () =>
          import('./pages/table-detail/table-configs/table-config.page').then(
            (m) => m.DbTableConfigPage,
          ),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import(
            './pages/table-detail/table-documents/table-documents.page'
          ).then((m) => m.DbTableDocumentsPage),
      },
      {
        path: 'migrations',
        loadComponent: () =>
          import(
            './pages/table-detail/table-migration/table-migration.page'
          ).then((m) => m.DbTableMigrationPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'columns',
      },
    ],
  },
  {
    path: ':databaseId',
    canActivate: [roleGuard],
    data: { roles: ['SuperAdmin'] },
    loadComponent: () =>
      import('./pages/database-detail/database-detail.page').then(
        (m) => m.DatabaseDetailComponent,
      ),
    children: [
      {
        path: 'tables',
        loadComponent: () =>
          import(
            './pages/database-detail/table-list/table-list.component'
          ).then((m) => m.TableListComponent),
      },
      {
        path: 'config',
        loadComponent: () =>
          import('./pages/database-detail/db-config/db-config.component').then(
            (m) => m.DbConfigComponent,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tables',
      },
    ],
  },
];
