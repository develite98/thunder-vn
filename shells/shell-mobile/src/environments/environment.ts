import type { IAppConfig } from '@mixcore/app-config';

export const appSetting: IAppConfig = {
  apiUrl: 'https://luffy.uat.4ps.dev',
  production: false,
  appSetting: {
    appName: 'Mixcore',
    appLogoUrl: '/logos/logo-4ps.svg',
    appVersion: '1.0.0',
    appDescription: 'A portal for Mixcore applications',
    appCopyright: '© Copyright 2025 by Mixcore Team',
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
            title: 'common.menu.home',
            url: '/app/home/dashboard',
            group: 'Core',
            icon: 'house',
          },
          {
            title: 'common.menu.newsfeed',
            url: '/app/db',
            group: 'Core',
            icon: 'newspaper',
            isDevelopment: true,
          },
          {
            title: 'common.menu.messenger',
            url: '/app/iam',
            group: 'Core',
            icon: 'message-circle',
            isDevelopment: true,
          },
          {
            title: 'common.menu.ticket',
            url: '/app/ticket',
            group: 'Core',
            icon: 'list-checks',
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
    ],
  },
  tenants: [
    {
      id: 'default',
      name: 'Luffy DEV',
      domain: 'https://luffy.dev.4ps.dev',
      gitHubApiUrl: 'https://api.github.com/repos/mixcore/mix.core',
    },
  ],
};
