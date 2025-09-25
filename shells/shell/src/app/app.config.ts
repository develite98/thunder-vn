import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  Injectable,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  provideTransloco,
  Translation,
  TranslocoLoader,
} from '@jsverse/transloco';
import { provideBaseAppConfig } from '@mixcore/app-config';
import {
  popperVariation,
  provideTippyConfig,
  provideTippyLoader,
  tooltipVariation,
} from '@ngneat/helipopper/config';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { icons, LucideAngularModule } from 'lucide-angular';
import { appRoutes } from './app.routes';

import { appSetting } from '../environments/environment';

import { getAuth, provideAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/i18n/${lang}/common.json`);
  }
}

export function initDefaultLang() {
  const browserLang = navigator.language.split('-')[0];
  const availableLangs = appSetting.appSetting?.supportedLanguages || [];
  const defaultLang = appSetting.appSetting?.defaultLanguage || 'en';

  const storedLang = localStorage.getItem('i18n');
  if (storedLang && availableLangs.includes(storedLang)) {
    return storedLang;
  }

  const langToUse = availableLangs.includes(browserLang)
    ? browserLang
    : defaultLang;

  return langToUse;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideBaseAppConfig(appSetting),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: appSetting.appSetting?.supportedLanguages || [
          'en',
          'vi',
        ],
        defaultLang: initDefaultLang(),
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideTippyLoader(() => import('tippy.js')),
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      },
    }),
    importProvidersFrom(LucideAngularModule.pick(icons)),
    provideHotToastConfig({ position: 'top-right' }),
    provideAuth(() => getAuth()),
  ],
};
