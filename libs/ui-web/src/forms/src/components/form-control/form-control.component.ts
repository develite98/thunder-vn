/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  TrackByFunction,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormUtils } from '@mixcore/helper';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixIconComponent } from '@mixcore/ui/icons';
import {
  FieldWrapper,
  FormlyFieldConfig,
  FormlyFieldProps,
} from '@ngx-formly/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { FormInternalEvent } from '../../states/form-internal.store';
import { IFormRecommend, IPropsConfig } from '../../types';
import { FormValidationMessage } from './form-control.error';

@Component({
  selector: 'mix-form-control',
  standalone: true,
  imports: [
    MixButtonComponent,
    TranslocoPipe,
    FormValidationMessage,
    MixIconComponent,
  ],
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormControlComponent extends FieldWrapper<
  FormlyFieldConfig<FormlyFieldProps>
> {
  public readonly destroyRef = inject(DestroyRef);
  public readonly internalEvent = inject(FormInternalEvent);

  public readonly defaultValue = new BehaviorSubject<any>(null);
  public readonly valueChanged = signal<boolean>(false);

  public readonly recommends = computed(
    () => (this.props as IPropsConfig).recommends || [],
  );

  public zoom = signal(false);

  public readonly labelClass = computed(() =>
    this.zoom() ? 'col-span-12 md:col-span-4' : 'col-span-12 md:col-span-5',
  );

  public readonly valueClass = computed(() =>
    this.zoom() ? 'col-span-12 md:col-span-8' : 'col-span-12 md:col-span-7',
  );

  public readonly isEditorType = computed(() => this.field.type === 'editor');

  public readonly trackByRecommend: TrackByFunction<IFormRecommend> = (
    index: number,
    item: IFormRecommend,
  ) => item.value;

  public readonly onSubmitHandler = () => this.onSubmit();
  public readonly onZoomToggle = () => this.zoom.set(!this.zoom());
  public readonly onRecommendClick = (value: any) =>
    this.formControl?.patchValue(value);

  ngOnInit() {
    const control = this.field.formControl;
    if (!control) return;

    combineLatest([control.valueChanges, this.defaultValue])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([value, defaultValue]) => {
        this.valueChanged.set(defaultValue !== value);
      });
  }

  public onReset() {
    this.defaultValue.next(this.field.formControl?.value);
  }

  public onSubmit() {
    const control = this.field.formControl;
    if (!control || !this.valueChanged()) return;

    if (FormUtils.validateForm(control)) {
      this.internalEvent.formControlSubmitListener$.next({
        field: this.field.key as string,
        newValue: this.field.formControl?.value,
        resetControl: this.onReset.bind(this),
      });
    }
  }
}
