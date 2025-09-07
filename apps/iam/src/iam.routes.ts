import { Route } from '@angular/router';
import { roleGuard } from 'libs/core/src/permissions';

export const ROUTES: Route[] = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: ['SuperAdmin'] },
    loadComponent: () =>
      import('./pages/iam/iam.page').then((m) => m.IamRootPage),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/iam/users/users.page').then((m) => m.IamUsersPage),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./pages/iam/roles/roles.page').then((m) => m.IamRolesPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/iam/setting/setting.page').then(
            (m) => m.IamSettingPage,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users',
      },
    ],
  },
  {
    path: 'user/:userId',
    canActivate: [roleGuard],
    data: { roles: ['SuperAdmin'] },
    loadComponent: () =>
      import('./pages/user-detail/user-detail.page').then(
        (m) => m.IamUserDetailPage,
      ),
    children: [
      {
        path: 'config',
        loadComponent: () =>
          import('./pages/user-detail/user-config/user-config.page').then(
            (m) => m.IamUserConfigPageComponent,
          ),
      },
      {
        path: 'role',
        loadComponent: () =>
          import('./pages/user-detail/user-role/user-role.page').then(
            (m) => m.IamUserRolePageComponent,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'config',
      },
    ],
  },
];
