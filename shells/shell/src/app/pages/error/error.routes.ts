import { Route } from '@angular/router';

export const errorRoutes: Route[] = [
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./un-authorized.component').then((m) => m.UnAuthorizedComponent),
  },
];
