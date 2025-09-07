import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { APP_CURRENCY } from './currency.token';

const CURRENCY_CONFIG: Record<string, { locale: string; symbol: string }> = {
  USD: { locale: 'en-US', symbol: 'USD' },
  VND: { locale: 'vi-VN', symbol: 'VND' },
  IDR: { locale: 'id-ID', symbol: 'IDR' },
};

@Component({
  selector: 'mix-currency',
  imports: [],
  templateUrl: './currency.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixCurrencyComponent {
  public value = input<number | null>(0);
  public currency = input<'USD' | 'VND' | 'IDR' | string | undefined>('USD');
  public currencyProvided = inject(APP_CURRENCY, { optional: true });

  public display = computed(() => {
    const currencyKey =
      this.currency() || this.currencyProvided?.currencySymbol || 'USD';

    const config = CURRENCY_CONFIG[currencyKey] || CURRENCY_CONFIG['USD'];
    const output = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.symbol,
      maximumFractionDigits: 1,
    }).format(this.value() || 0);

    const number = output.match(/[\d.,]+/)?.[0] || '';
    const text = output.replace(/[\d.,]+/, '').trim();

    return `${number}${text}`;
  });
}
