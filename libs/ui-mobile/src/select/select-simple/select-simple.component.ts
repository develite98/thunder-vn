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
import { TranslocoPipe } from '@jsverse/transloco';
import { MixIconComponent } from '@mixcore/ui/icons';
import { DialogService } from '@ngneat/dialog';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
type DisplayName = { displayName?: string; value?: any };

@Component({
  selector: 'mix-select-simple',
  templateUrl: './select-simple.component.html',
  styleUrls: ['./select-simple.component.css'],
  imports: [MixIconComponent, TranslocoPipe, NgTemplateOutlet],
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
export class MixSelectSimpleComponent<T = any> {
  protected dialog = inject(DialogService);
  protected cva = inject<NgxControlValueAccessor<string>>(
    NgxControlValueAccessor,
  );

  public items = input<T[]>([]);
  public displayItems = model<(DisplayName & T)[]>([]);
  public temporaryValue: T | undefined = undefined;

  @Input() public valueKey = '';
  @Input() public okLabel = 'common.ok';
  @Input() public cancelLabel = 'common.cancel';

  @Input() public placeHolder = 'Select something';
  @Input() public labelProcess?: (item: T) => string = undefined;
  @Input() public templateRef: TemplateRef<unknown> | undefined;

  public selectedItem$ = computed(() => {
    const value = this.cva.value$();
    if (!value) return undefined;

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
    if (this.valueKey && item[this.valueKey]) {
      this.cva.value = item[this.valueKey];
      return;
    }

    this.cva.value = item;
  }

  public showDialog(template: TemplateRef<any>) {
    this.dialog.open(template, { windowClass: 'mobile-dialog-select-simple' });
  }

  public ngOnInit() {
    this.temporaryValue = this.cva.value as T;
  }

  public onConfirm() {
    if (this.temporaryValue) {
      this.cva.value = this.temporaryValue as string;
    }
  }

  public onCancel() {
    this.temporaryValue = this.cva.value as T;
  }
}
