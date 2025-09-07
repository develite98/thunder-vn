import { inject, InjectionToken } from '@angular/core';
import type { TGroupMenuItem } from '@mixcore/types';

export enum ELoginProvider {
  Google = 'Google',
  Facebook = 'Facebook',
  GitHub = 'GitHub',
  Microsoft = 'Microsoft',
}

export interface IAppTheme {
  value: string;
  name: string;
}

export interface IExternalLoginProvider {
  Type: ELoginProvider;
  Enable: boolean;
  Config: Record<string, string>;
}

export interface ITenant {
  id: string;
  domain: string;
  name: string;
  gitHubApiUrl?: string;
  externalLoginProviders?: IExternalLoginProvider[];

  sideBarMenu?: TGroupMenuItem[];
  subSidebarMenu?: TGroupMenuItem[];
}

export interface IAppSetting {
  appName?: string;
  appVersion?: string;
  appDescription?: string;
  appCopyright?: string;
  appLogoUrl?: string;
  termConditionUrl?: string;
  documentUrl?: string;

  defaultTheme?: string;
  supportedThemes?: IAppTheme[];

  defaultLanguage?: string;
  supportedLanguages?: string[];

  sideBarMenu?: TGroupMenuItem[];
  subSidebarMenu?: TGroupMenuItem[];
}

export interface IAppConfig {
  production: boolean;
  apiUrl: string;
  loginUrl?: string;
  appSetting?: IAppSetting;
  tenants?: ITenant[];
  [key: string]: string | boolean | IAppSetting | ITenant[] | undefined;
}

export const BASE_APP_CONFIG = new InjectionToken<IAppConfig>('');
export const provideBaseAppConfig = (config: IAppConfig) => {
  if (document) {
    document.title = config.appSetting?.appName || 'Web Application';
  }

  return {
    provide: BASE_APP_CONFIG,
    useValue: config,
  };
};

export const injectAppConfig = () => {
  return inject(BASE_APP_CONFIG);
};
