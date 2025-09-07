import { InjectionToken } from '@angular/core';

export const APP_CURRENCY = new InjectionToken<{
  locale: string;
  currencySymbol: string;
}>('CURRENCY');

export const provideCurrency = (locale = 'en-US', currencySymbol = 'USD') => ({
  provide: APP_CURRENCY,
  useValue: {
    locale,
    currencySymbol,
  },
});
