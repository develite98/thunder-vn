import { Route } from '@angular/router';

export const publicRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent,
      ),
  },
];
