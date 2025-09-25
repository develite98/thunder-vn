import { ELoginProvider, type IAppConfig } from '@mixcore/app-config';

export const appSetting: IAppConfig = {
  apiUrl: 'https://luffy.uat.4ps.dev',
  production: false,
  appSetting: {
    appName: 'Pizza 4Ps',
    appLogoUrl: '/logos/logo-4ps.svg',
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
    sideBarMenu: [
      {
        group: 'Core',
        label: 'Core',
        items: [
          // {
          //   title: 'common.menu.aias',
          //   url: '/app/ai',
          //   group: 'Core',
          //   icon: 'bot-message-square',
          //   separator: true,
          // },
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
            roles: ['SuperAdmin'],
          },
          {
            title: 'common.menu.finance',
            url: '/app/finance',
            group: 'Core',
            icon: 'landmark',
          },
          {
            title: 'common.menu.bms',
            url: '/app/bms',
            group: 'Core',
            icon: 'store',
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
          {
            title: 'common.menu.menus',
            url: '/app/bms/menus',
            group: 'Core',
            icon: 'coffee',
          },
        ],
      },
    ],
  },
  tenants: [
    {
      id: 'default',
      name: 'Luffy UAT',
      domain: 'https://luffy.uat.4ps.dev',
      gitHubApiUrl: 'https://api.github.com/repos/mixcore/mix.core',
      externalLoginProviders: [
        {
          Type: ELoginProvider.Google,
          Enable: true,
          Config: {
            apiKey: 'AIzaSyDBPuYqa5t1KKe4g7_BMqajonmiMrRuPBo',
            authDomain: 'pizza-4ps-ecosystem.firebaseapp.com',
            projectId: 'pizza-4ps-ecosystem',
            storageBucket: 'pizza-4ps-ecosystem.appspot.com',
            messagingSenderId: '263592914041',
            appId: '1:263592914041:web:24121d78c41fca8a6878a8',
          },
        },
      ],
    },
    {
      id: 'tenant1',
      name: 'Luffy Develop',
      domain: 'https://luffy.uat.4ps.dev',
      gitHubApiUrl: 'https://api.github.com/repos/mixcore/mix.core',
    },
  ],
};
