import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./app.component').then((c) => c.AppComponent),
    children: [
      {
        path: 'c',
        loadComponent: () =>
          import('./pages/chat/chat.page').then((c) => c.MixAIChatPage),
      },
      {
        path: '',
        redirectTo: 'c',
        pathMatch: 'full',
      },
    ],
  },
];
