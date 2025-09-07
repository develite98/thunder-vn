import { inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  getState,
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { filter } from 'rxjs';

export const LocationHistoryStore = signalStore(
  {
    providedIn: 'root',
  },
  withState({
    currentUrl: '',
    previousUrl: '',
    historyLog: <{ currentUrl: string; previousUrl: string }[]>[],
  }),
  withHooks((store, router = inject(Router)) => ({
    onInit: () => {
      patchState(store, (s) => ({
        currentUrl: window.location.pathname,
        previousUrl: s.currentUrl,
        historyLog: [
          {
            currentUrl: window.location.pathname,
            previousUrl: s.currentUrl,
          },
        ],
      }));

      router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          const state = getState(store);
          const navigationStack = state.historyLog || [];
          const lastEntry = navigationStack[navigationStack.length - 1];

          if (lastEntry && lastEntry.currentUrl === event.url) {
            return;
          }

          if (navigationStack.length >= 20) {
            navigationStack.shift();
          }

          // Add new entry to the history log
          navigationStack.push({
            currentUrl: event.url,
            previousUrl: state.currentUrl,
          });

          // Update current and previous URLs
          patchState(store, (s) => ({
            historyLog: navigationStack,
            previousUrl: s.currentUrl,
            currentUrl: event.url,
          }));
        });
    },
  })),
  withMethods(() => ({
    back: () => {
      window.history.back();
    },
  })),
);

export const injectLocationHistory = () => {
  return inject(LocationHistoryStore);
};
