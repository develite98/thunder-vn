import { inject, Injectable, InjectionToken } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  InlineLoader,
  provideTranslocoScope,
  Translation,
} from '@jsverse/transloco';

export interface IMiniAppConfig {
  basePath?: string;
  appName: string;
  appDisplayName?: string;
  languages?: string[];
}

export const MINI_APP_CONFIG = new InjectionToken<IMiniAppConfig>(
  'mini-app-config',
);

export const provideMiniAppConfig = (config: IMiniAppConfig) => {
  return [
    provideTranslocoScope({
      scope: config.appName,
      alias: config.appName,
      loader: (config.languages || ['en', 'vi']).reduce(
        (acc, lang) => {
          acc[lang] = async () => {
            const path = `/i18n/${lang}/${config.appName}.json`;
            const response = await fetch(path);
            return response.json();
          };
          return acc;
        },
        {} as Record<string, () => Promise<Translation>>,
      ) as unknown as InlineLoader,
    }),
    {
      provide: MINI_APP_CONFIG,
      useValue: config,
    },
    MiniAppRouter,
  ];
};

export const injectMiniAppConfig = (optional?: boolean) => {
  return inject(MINI_APP_CONFIG, { optional });
};

@Injectable()
export class MiniAppRouter {
  readonly router = inject(Router);
  readonly activeRouter = inject(ActivatedRoute);
  readonly miniAppConfig = inject(MINI_APP_CONFIG);
  public basePath = this.miniAppConfig.basePath || '';
  public baseSegment: string[] = [];
  public isInit = false;

  public navigate(
    urls: (string | number)[],
    queryParams: Record<string, string> = {},
    replaceUrl = false,
  ): void {
    this.init();

    this.router.navigate([...this.baseSegment, ...urls], {
      queryParams,
      replaceUrl,
    });
  }

  public isActive(urls: string[]): boolean {
    this.init();

    const path = [...this.baseSegment, ...urls]
      .map((segment) => segment.replace(/^\/|\/$/g, ''))
      .filter(Boolean)
      .join('/');
    const fullPath = '/' + path;

    return this.router.isActive(fullPath, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  public init() {
    if (this.isInit) return;

    this.isInit = true;

    const path = this.miniAppConfig.basePath || '';
    const currentRouteSegments = window.location.pathname
      .split('/')
      .filter(Boolean);

    const indexOfQueryPath = currentRouteSegments.indexOf(path);
    if (indexOfQueryPath !== -1) {
      this.baseSegment = currentRouteSegments.slice(0, indexOfQueryPath + 1);
    } else {
      this.baseSegment = currentRouteSegments;
    }
  }
}

export const injectMiniAppRouter = () => {
  return inject(MiniAppRouter);
};
