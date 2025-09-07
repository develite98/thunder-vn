import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import 'cally';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

@Component({
  selector: 'mix-date-picker',
  templateUrl: './date-picker.component.html',
  imports: [],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NgxControlValueAccessor,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MixDatePickerComponent {
  protected cva = inject<NgxControlValueAccessor<string | Date | undefined>>(
    NgxControlValueAccessor,
  );
}
