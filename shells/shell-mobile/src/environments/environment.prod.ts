import { IAppConfig } from '@mixcore/app-config';

export const appSetting: IAppConfig = {
  apiUrl: 'https://api.mixcore.org',
  production: false,
  appSetting: {
    appName: 'Mixcore',
    appVersion: '1.0.0',
    appDescription: 'A portal for Mixcore applications',
    defaultTheme: 'light',
    appCopyright: '© 2023 Mixcore Team',
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
        name: 'Lemonade',
        value: 'lemonade',
      },
    ],
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'vi'],
  },
};
