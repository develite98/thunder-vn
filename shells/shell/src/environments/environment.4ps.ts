import type { IAppConfig } from '@mixcore/app-config';

export const appSetting: IAppConfig = {
  apiUrl: 'https://luffy.uat.4ps.dev',
  production: false,
  appSetting: {
    appName: `Pizza 4p's`,
    appVersion: '1.0.0',
    appDescription: `A portal for Pizza 4p's applications`,
    appCopyright: `© Copyright 2025 by Pizza 4p's Team`,
    defaultTheme: 'light',
    supportedThemes: [
      {
        name: 'Light',
        value: 'light',
      },
      {
        name: 'Dark',
        value: 'dark',
      },
      {
        name: 'Dracula',
        value: 'dracula',
      },
      {
        name: 'Night',
        value: 'night',
      },
    ],
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'vi'],
    sideBarMenu: [
      {
        group: 'Core',
        label: 'Core',
        items: [
          {
            title: 'common.menu.overview',
            url: '/app/overview',
            group: 'Core',
            icon: 'layout-dashboard',
          },
          {
            title: 'common.menu.database',
            url: '/app/db',
            group: 'Core',
            icon: 'database',
            roles: ['SupperAdmin'],
          },
          {
            title: 'common.menu.auth',
            url: '/app/iam',
            group: 'Core',
            icon: 'book-user',
            roles: ['SupperAdmin'],
          },
          {
            title: 'common.menu.agency',
            url: '/app/e-com/agency',
            group: 'Core',
            roles: ['SupperAdmin'],
            icon: 'store',
          },
          {
            title: 'common.menu.orders',
            url: '/app/e-com/orders',
            group: 'Core',
            icon: 'shopping-cart',
            roles: ['SupperAdmin'],
          },
          {
            title: 'common.menu.products',
            url: '/app/e-com/products',
            group: 'Core',
            icon: 'shopping-bag',
            roles: ['SupperAdmin'],
          },
          {
            title: 'common.menu.subscribers',
            url: '/app/e-com/subscribers',
            group: 'Core',
            icon: 'shopping-bag',
            roles: ['SupperAdmin'],
          },
          {
            title: 'common.menu.finance',
            url: '/app/finance',
            group: 'Core',
            icon: 'landmark',
          },
        ],
      },
    ],
    subSidebarMenu: [
      {
        pathMatch: '^/app/finance/[^/]+(/.*)?$',
        items: [
          {
            title: 'common.menu.voidBill',
            url: '/app/db',
            group: 'Core',
            icon: 'database',
          },
          {
            title: 'auth.menu.title',
            url: '/app/iam',
            group: 'Core',
            icon: 'book-user',
          },
        ],
      },
    ],
  },
  tenants: [
    {
      id: 'default',
      name: 'Luffy Develop',
      domain: 'https://luffy.uat.4ps.dev',
      gitHubApiUrl: 'https://api.github.com/repos/mixcore/mix.core',
    },
    {
      id: 'tenant1',
      name: 'Mixcore App',
      domain: 'https://mix-apps.net',
      gitHubApiUrl: 'https://api.github.com/repos/mixcore/mix.core',
    },
  ],
};
