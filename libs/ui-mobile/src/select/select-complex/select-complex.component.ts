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
  signal,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import {
  BottomSheetRef,
  injectBottomSheet,
} from '@mixcore/ui-mobile/bottom-sheet';
import { MixIconComponent } from '@mixcore/ui/icons';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
type DisplayName = { displayName?: string; value?: any };

@Component({
  selector: 'mix-select-complex',
  templateUrl: './select-complex.component.html',
  styleUrls: ['./select-complex.component.css'],
  imports: [MixIconComponent, TranslocoModule, NgTemplateOutlet, FormsModule],
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
export class MixSelectComplexComponent<T = any> {
  protected dialog = injectBottomSheet();
  protected cva = inject<NgxControlValueAccessor<string>>(
    NgxControlValueAccessor,
  );

  public items = input<T[]>([]);
  public displayItems = model<(DisplayName & T)[]>([]);
  public temporaryValue: T | undefined = undefined;
  public bottomSheetRef: BottomSheetRef<T> | undefined = undefined;
  public searchText = signal<string>('');

  @Input() public okLabel = 'common.ok';
  @Input() public cancelLabel = 'common.cancel';
  @Input() public valueKey = '';
  @Input() public placeHolder = 'Select something';
  @Input() public buttonTemplateRef: TemplateRef<unknown> | undefined;
  @Input() public optionTemplateRef: TemplateRef<unknown> | undefined;

  @Input() public labelProcess?: (item: T) => string = undefined;
  @Input() public searchFn?: (item: T, searchText: string) => boolean;

  public selectedItem$ = computed(() => {
    const value = this.cva.value$();
    if (!value) return undefined;

    return this.displayItems().find((item) => item.value === value);
  });

  public filteredItems$ = computed(() => {
    const searchText = this.searchText().toLowerCase();

    return this.displayItems().filter((item) => {
      if (this.searchFn) {
        return this.searchFn(item as T, searchText);
      }

      return item;
    });
  });

  public selectItem(item: any) {
    if (this.valueKey && item[this.valueKey]) {
      this.cva.value = this.valueKey ? item[this.valueKey] : item;
      return;
    }

    this.cva.value = item;
  }

  public showDialog(template: TemplateRef<any>) {
    this.bottomSheetRef = this.dialog.open(template, {
      cssClass: 'mobile-select-complex',
    });
  }

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

  public ngOnInit() {
    this.temporaryValue = this.cva.value as T;
  }

  public onConfirm() {
    if (this.temporaryValue) {
      this.cva.value = this.temporaryValue as string;
    }

    if (this.bottomSheetRef) {
      this.bottomSheetRef.close(this.temporaryValue);
    }
  }

  public onCancel() {
    this.temporaryValue = this.cva.value as T;

    if (this.bottomSheetRef) {
      this.bottomSheetRef.close(this.temporaryValue);
    }
  }
}
