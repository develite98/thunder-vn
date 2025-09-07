import { computed } from '@angular/core';
import { injectAppConfig } from '@mixcore/app-config';
import { withLocalStorage } from '@mixcore/signal';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withProps((store, appConfig = injectAppConfig()) => ({
    supportedThemes: appConfig.appSetting?.supportedThemes || [],
  })),
  withState(() => ({
    active: 'light',
  })),
  withComputed((store) => ({
    themes: computed(() => store.supportedThemes),
    activeTheme: computed(() => store.active()),
  })),
  withMethods((store) => ({
    chooseTheme: (theme: string) => {
      if (theme && store.supportedThemes.some((t) => t.value === theme)) {
        patchState(store, (s) => ({ ...s, active: theme }));
        document?.documentElement.setAttribute('data-theme', theme);
      }
    },
  })),
  withLocalStorage('app-theme'),
);
