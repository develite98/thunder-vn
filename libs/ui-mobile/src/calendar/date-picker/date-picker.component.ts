/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { DateUtils } from '@mixcore/helper';
import {
  BottomSheetRef,
  injectBottomSheet,
} from '@mixcore/ui-mobile/bottom-sheet';
import { MixIconComponent } from '@mixcore/ui/icons';
import 'cally';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

@Component({
  selector: 'mix-date-picker-m',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  imports: [MixIconComponent, TranslocoPipe, DatePipe, NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
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
  protected dialog = injectBottomSheet();
  protected cva = inject<NgxControlValueAccessor<string | null>>(
    NgxControlValueAccessor,
  );

  public temporaryValue: string | Date | null | undefined = undefined;
  public bottomSheetRef: BottomSheetRef | undefined = undefined;

  @Input() public valueKey = '';
  @Input() public okLabel = 'common.ok';
  @Input() public cancelLabel = 'common.cancel';

  @Input() public placeHolder = 'Select something';
  @Input() public buttonTemplateRef: TemplateRef<unknown> | undefined;

  public selectedItem$ = computed(() => {
    const value = this.cva.value$();
    if (!value) return undefined;

    return DateUtils.toShortDate(value);
  });

  public showDialog(template: TemplateRef<any>) {
    this.bottomSheetRef = this.dialog.open(template, {
      cssClass: 'mobile-dialog-date-picker-simple',
    });
  }

  public ngOnInit() {
    this.temporaryValue = this.cva.value;
  }

  public onConfirm() {
    if (this.temporaryValue) {
      this.cva.value = this.temporaryValue as string;
    }

    if (this.bottomSheetRef) {
      this.bottomSheetRef.close();
    }
  }

  public onCancel() {
    this.temporaryValue = this.cva.value;

    if (this.bottomSheetRef) {
      this.bottomSheetRef.close();
    }
  }

  public onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value as string;
    const date = new Date(value);

    const startOfDay = DateUtils.toStartOfDay(date).toISOString();
    this.temporaryValue = startOfDay;
  }
}
