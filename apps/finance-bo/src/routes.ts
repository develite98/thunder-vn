import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./app.component').then((c) => c.AppComponent),
    children: [
      {
        path: 'void-bill/:requestId/:orderId',
        loadComponent: () =>
          import('./pages/cancel-orders/detail/detail.page').then(
            (c) => c.EInvoiceDetailPage,
          ),
      },
      {
        path: 'void-bill',
        loadComponent: () =>
          import('./pages/cancel-orders/cancel-orders.page').then(
            (c) => c.FinanceCancelOrders,
          ),
        children: [
          {
            path: 'need-process',
            loadComponent: () =>
              import(
                './pages/cancel-orders/need-process/need-process.page'
              ).then((c) => c.FinanceVoidBillNeedProcess),
          },
          {
            path: 'processed',
            loadComponent: () =>
              import('./pages/cancel-orders/processed/processed.page').then(
                (c) => c.FinanceVoidBillProcessed,
              ),
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'need-process',
          },
        ],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'void-bill',
      },
    ],
  },
];
