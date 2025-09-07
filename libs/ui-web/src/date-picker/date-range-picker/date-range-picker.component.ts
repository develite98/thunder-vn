import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { DateUtils } from '@mixcore/helper';
import { MixIconComponent } from '@mixcore/ui/icons';
import { TippyDirective } from '@ngneat/helipopper';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

@Component({
  selector: 'mix-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NgxControlValueAccessor,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [TippyDirective, MixIconComponent, DatePipe, TranslocoPipe],
})
export class MixDateRangePickerComponent {
  protected cva = inject<
    NgxControlValueAccessor<{ from: string; to: string } | null>
  >(NgxControlValueAccessor);

  public placeHolder = input('common.placeholder.dateRange');

  public onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value as string;
    const [from, to] = value.split('/').map((date) => new Date(date));

    const startOfDay = DateUtils.toStartOfDay(from).toISOString();
    const endOfDay = DateUtils.toEndOfDay(to).toISOString();

    this.cva.value = {
      from: startOfDay,
      to: endOfDay,
    };
  }

  public formatDate(
    date: { from: string; to: string } | null,
  ): string | undefined {
    if (!date || !date.from || !date.to) {
      return undefined;
    }

    return `${DateUtils.toShortDate(date.from)}/${DateUtils.toShortDate(date.to)}`;
  }
}
