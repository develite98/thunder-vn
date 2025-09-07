import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  FieldWrapper,
  FormlyFieldConfig,
  FormlyFieldProps,
} from '@ngx-formly/core';
import { FormInternalEvent } from '../../states/form-internal.store';
import { IFormRecommend, IPropsConfig } from '../../types';
import { MixFormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'mix-form-control',
  standalone: true,
  imports: [MixFormFieldComponent],
  template: `
    <mix-form-field
      class="w-full mb-8"
      [required]="props.required || false"
      [name]="props.label"
    >
      <ng-template #fieldComponent></ng-template>
    </mix-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormControlSimpleComponent extends FieldWrapper<
  FormlyFieldConfig<FormlyFieldProps>
> {
  public internalEvent = inject(FormInternalEvent);
  public recommends: IFormRecommend[] = [];

  ngOnInit() {
    const control = this.field.formControl;
    if (!control) return;

    this.recommends = (this.props as IPropsConfig).recommends || [];
  }
}
