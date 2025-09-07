/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  Input,
  model,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import { MixIconComponent } from '@mixcore/ui/icons';
import { TippyDirective } from '@ngneat/helipopper';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

type DisplayName = { displayName?: string; value?: any };

@Component({
  selector: 'mix-select',
  templateUrl: './select-simple.component.html',
  styleUrls: ['./select-simple.component.css'],
  imports: [MixIconComponent, NgTemplateOutlet, TippyDirective],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NgxControlValueAccessor,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
})
export class MixSelectComponent<T = any> {
  protected cva = inject<NgxControlValueAccessor<string>>(
    NgxControlValueAccessor,
  );

  public items = input<T[]>([]);
  public displayItems = model<(DisplayName & T)[]>([]);

  @Input() public valueKey = '';
  @Input() public okLabel = 'common.ok';
  @Input() public cancelLabel = 'common.cancel';

  @Input() public placeHolder = 'Select something';
  @Input() public labelProcess?: (item: T) => string = undefined;
  @Input() public templateRef: TemplateRef<unknown> | undefined;

  public selectedItem$ = computed(() => {
    const value = this.cva.value$();
    if (value === undefined || value === null) return undefined;

    return this.displayItems().find((item) => item.value === value);
  });

  constructor() {
    effect(() => {
      const labelProcess = this.labelProcess;
      if (!labelProcess) return;

      const items = this.items();

      this.displayItems.set(
        items.map((item) => {
          return {
            ...item,
            displayName: labelProcess(item),
            value: (item as any)[this.valueKey] ?? item,
          };
        }),
      );
    });
  }

  public selectItem(item: any) {
    if (
      this.valueKey &&
      item[this.valueKey] !== undefined &&
      item[this.valueKey] !== null
    ) {
      this.cva.value = item[this.valueKey];
      return;
    }

    this.cva.value = item;
  }
}
