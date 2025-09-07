import { type IAppConfig } from '@mixcore/app-config';

export const appSetting: IAppConfig = {
  apiUrl: 'https://luffy.uat.4ps.dev',
  production: false,
  homePage: 'ecom',
  appSetting: {
    appName: 'Thunderbird VN',
    appLogoUrl: '/logos/app-logo.svg',
    appVersion: '1.0.0',
    appDescription: 'A portal for 4Ps applications',
    appCopyright: '© Copyright 2025 by 4Ps Team',
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
  },
  tenants: [
    {
      id: 'default',
      name: 'Thunder App',
      domain: 'https://mix-apps.net',
      gitHubApiUrl: 'https://api.github.com/repos/mixcore/mix.core',
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
              roles: ['SuperAdmin'],
            },
            {
              title: 'common.menu.auth',
              url: '/app/iam',
              group: 'Core',
              icon: 'book-user',
              separator: true,
            },
            {
              title: 'common.menu.agency',
              url: '/app/e-com/agency',
              group: 'Core',
              icon: 'store',
            },
            {
              title: 'common.menu.orders',
              url: '/app/e-com/orders',
              group: 'Core',
              icon: 'shopping-cart',
            },
            {
              title: 'common.menu.products',
              url: '/app/e-com/products',
              group: 'Core',
              icon: 'shopping-bag',
              separator: true,
            },
            {
              title: 'common.menu.subscribers',
              url: '/app/e-com/subscribers',
              group: 'Core',
              icon: 'user-plus',
              separator: true,
            },
            {
              title: 'common.menu.socialNetworks',
              url: '/app/e-com/networks',
              group: 'Core',
              icon: 'network',
            },
            {
              title: 'common.menu.pages',
              url: '/app/e-com/pages',
              group: 'Core',
              icon: 'shopping-bag',
            },
            {
              title: 'common.menu.blogs',
              url: '/app/e-com/blogs',
              group: 'Core',
              icon: 'newspaper',
            },
            {
              title: 'common.menu.banners',
              url: '/app/e-com/banners',
              group: 'Core',
              icon: 'image',
            },
            {
              title: 'common.menu.storeSettings',
              url: '/app/e-com/website-builder/1',
              group: 'Core',
              icon: 'settings',
            },
          ],
        },
      ],
      subSidebarMenu: [
        {
          pathMatch: '^/app/finance',
          items: [
            {
              title: 'common.menu.voidBill',
              url: '/app/finance/void-bill',
              group: 'Core',
              icon: 'database',
            },
          ],
        },
        {
          pathMatch: '^/app/bms',
          items: [
            {
              title: 'common.menu.stores',
              url: '/app/bms/stores',
              group: 'Core',
              icon: 'store',
            },
            {
              title: 'common.menu.brands',
              url: '/app/bms/brands',
              group: 'Core',
              icon: 'trello',
              isDevelopment: true,
            },
            {
              title: 'common.menu.users',
              url: '/app/bms/users',
              group: 'Core',
              icon: 'users',
              isDevelopment: true,
            },
          ],
        },
      ],
    },
  ],
};
