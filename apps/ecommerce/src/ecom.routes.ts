import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const PublicRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'home',
        loadComponent: async () =>
          (await import('./pages/home-page/home-page.component'))
            .HomePageComponent,
      },
      {
        path: 'blogs',
        loadComponent: async () =>
          (await import('./pages/blogs-page/blogs-page.component'))
            .BlogsPageComponent,
      },
      {
        path: 'products',
        loadComponent: async () =>
          (await import('./pages/products-page/products-page.component'))
            .ProductsPageComponent,
      },
      {
        path: 'agencies',
        loadComponent: async () =>
          (await import('./pages/agencies/agencies.page'))
            .AgenciesPageComponent,
      },
      {
        path: 'p/:slug',
        loadComponent: async () =>
          (await import('./pages/page/page.component')).EcomPageComponent,
      },
      {
        path: 'b/:id',
        loadComponent: async () =>
          (await import('./pages/blog/blog.component')).EcomBlogComponent,
      },
      {
        path: 'contact',
        loadComponent: async () =>
          (await import('./pages/contact-page/contact-page.component'))
            .ContactPageComponent,
      },
      {
        path: 'agency',
        loadChildren: async () =>
          (await import('./pages/agency/agency.routes')).routes,
      },
      {
        path: 'product/:id',
        loadComponent: async () =>
          (
            await import(
              './pages/product-detail-page/product-detail-page.component'
            )
          ).ProductDetailPageComponent,
      },
      {
        path: 'checkout',
        loadComponent: async () =>
          (await import('./pages/checkout-page/checkout-page.component'))
            .CheckoutPageComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
