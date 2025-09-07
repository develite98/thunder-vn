import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: async () => (await import('./agency.page')).EcomAgencyPage,
    children: [
      {
        path: 'orders',
        loadComponent: async () =>
          (await import('./orders/agency-orders.page')).EcomAgencyOrdersPage,
      },
      {
        path: 'news',
        loadComponent: async () =>
          (await import('./news/agency-news.page')).AgencyNewsPage,
      },
      {
        path: 'orders/:id',
        loadComponent: async () =>
          (await import('./order-detail/order-detail.page'))
            .AgencyOrderDetalPage,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'orders',
      },
    ],
  },
];
