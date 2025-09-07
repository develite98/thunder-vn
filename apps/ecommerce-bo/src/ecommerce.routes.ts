import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/ecommerce/ecommerce.page').then(
        (m) => m.EcommerceRootPage,
      ),
    children: [
      {
        path: 'agency',
        loadComponent: () =>
          import('./pages/ecommerce/agency/agency.page').then(
            (m) => m.EcomAgencyPage,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'agency',
      },
    ],
  },
  {
    path: 'banners',
    loadComponent: () =>
      import('./pages/home-banner/home-banner.page').then(
        (m) => m.EcomHomeBannersPageComponent,
      ),
  },
  {
    path: 'subscribers',
    loadComponent: () =>
      import('./pages/subscribers/subscribers.page').then(
        (m) => m.EcomSubscribersPageComponent,
      ),
  },
  {
    path: 'networks',
    loadComponent: () =>
      import('./pages/social-networks/social-networks').then(
        (m) => m.EcomSocialNetworksPageComponent,
      ),
  },
  {
    path: 'agency/:id',
    loadComponent: () =>
      import('./pages/agency-detail/agency-detail.page').then(
        (m) => m.EcomAgencyDetailPage,
      ),
    children: [
      {
        path: 'config',
        loadComponent: () =>
          import('./pages/agency-detail/agency-config/agency-config.page').then(
            (c) => c.EcomAgencyConfigPage,
          ),
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./pages/agency-detail/agency-member/agency-member.page').then(
            (c) => c.EcomAgencyMemberPage,
          ),
      },
      {
        path: 'location',
        loadComponent: () =>
          import(
            './pages/agency-detail/agency-location/agency-location.page'
          ).then((c) => c.EcomAgencyLocationPage),
      },
      {
        path: 'order-inprogress',
        loadComponent: () =>
          import('./pages/agency-detail/orders-list/orders-list.page').then(
            (c) => c.EcomAgencyOrdeInprogressListPage,
          ),
      },
      {
        path: 'order-success',
        loadComponent: () =>
          import(
            './pages/agency-detail/orders-list-sucess/orders-list-sucess.page'
          ).then((c) => c.EcomOrderListSuccessPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'config',
      },
    ],
  },
  {
    path: 'order/:id',
    loadComponent: () =>
      import('./pages/order-detail/order-detail.page').then(
        (m) => m.EcomOrderDetailPage,
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/orders.page').then((m) => m.EcomOrdersPage),
    children: [
      {
        path: 'progressing',
        loadComponent: () =>
          import('./pages/orders/orders-list/orders-list.page').then(
            (c) => c.EcomOrderListPage,
          ),
      },
      {
        path: 'success',
        loadComponent: () =>
          import(
            './pages/orders/orders-list-sucess/orders-list-sucess.page'
          ).then((c) => c.EcomOrderListSuccessPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'progressing',
      },
    ],
  },
  {
    path: 'blogs/:id',
    loadComponent: () =>
      import('./pages/blog-detail/blog-detail.page').then(
        (m) => m.EcomBlogDetailPage,
      ),
    children: [
      {
        path: 'info',
        loadComponent: () =>
          import('./pages/blog-detail/blog-info/blog-info.page').then(
            (m) => m.EcomBlogDetailInfoPage,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'info',
      },
    ],
  },
  {
    path: 'blogs',
    loadComponent: () =>
      import('./pages/blogs/blogs.page').then((m) => m.EcomBlocksPageComponent),
  },
  {
    path: 'pages/:id',
    loadComponent: () =>
      import('./pages/page-detail/page-detail.page').then(
        (m) => m.EcomPageDetailPage,
      ),
    children: [
      {
        path: 'info',
        loadComponent: () =>
          import('./pages/page-detail/page-info/page-info.page').then(
            (m) => m.EcomPageDetailInfoPage,
          ),
      },
      {
        path: 'description',
        loadComponent: () =>
          import(
            './pages/page-detail/page-description/page-description.page'
          ).then((m) => m.EcomPageDescriptionInfoPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'info',
      },
    ],
  },
  {
    path: 'pages',
    loadComponent: () =>
      import('./pages/pages/pages.page').then((m) => m.EcomPagesPageComponent),
  },
  {
    path: 'website-builder/:id',
    loadComponent: () =>
      import('./pages/website-builder-detail/website-builder-detail.page').then(
        (m) => m.EcomWebsiteBuilderDetailPage,
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.page').then(
        (m) => m.ProductDetailpage,
      ),
    children: [
      {
        path: 'config',
        loadComponent: () =>
          import(
            './pages/product-detail/product-config/product-config.page'
          ).then((m) => m.ProductConfigPage),
      },
      {
        path: 'seo',
        loadComponent: () =>
          import('./pages/product-detail/product-seo/product-seo.page').then(
            (m) => m.ProductSeoPage,
          ),
      },
      {
        path: 'media',
        loadComponent: () =>
          import(
            './pages/product-detail/product-medias/product-media.page'
          ).then((m) => m.ProductMediaPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'config',
      },
    ],
  },
  {
    path: 'product-category/:id',
    loadComponent: () =>
      import(
        './pages/product-category-detail/product-category-detail.page'
      ).then((m) => m.ProductCategoryDetailPage),
    children: [
      {
        path: 'config',
        loadComponent: () =>
          import('./pages/product-category-detail/config/config.page').then(
            (m) => m.ProductCategoryConfigPage,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import(
            './pages/product-category-detail/product-list/product-list.page'
          ).then((m) => m.ProductCategoryProductListPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'config',
      },
    ],
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.page').then((m) => m.ProductsPage),
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('./pages/products/product-list/product-list.page').then(
            (m) => m.ProductListPage,
          ),
      },
      {
        path: 'category',
        loadComponent: () =>
          import(
            './pages/products/product-categories/product-categories.page'
          ).then((m) => m.ProductCategoriesPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
    ],
  },
];
