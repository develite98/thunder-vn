/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  contentChildren,
  inject,
  Input,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyFieldConfig,
  FormlyForm,
  provideFormlyCore,
} from '@ngx-formly/core';
import { FormInternalEvent } from '../../states/form-internal.store';
import { IFormSubmit } from '../../types';
import {
  FormCheckboxComponent,
  FormDatePickerComponent,
  FormImageUploadComponent,
  FormInputComponent,
  FormKeyValueInput,
  FormRichTextEditorComponent,
  FormTextAreaComponent,
} from '../controls';
import { FormControlSimpleComponent } from '../form-control-simple/form-control-simple.component';
import { FormControlComponent } from '../form-control/form-control.component';

@Component({
  selector: 'mix-form',
  standalone: true,
  imports: [FormlyForm, ReactiveFormsModule],
  templateUrl: './form.component.html',
  providers: [
    FormInternalEvent,
    provideFormlyCore({
      types: [
        { name: 'input', component: FormInputComponent, wrappers: ['default'] },
        {
          name: 'image',
          component: FormImageUploadComponent,
          wrappers: ['default'],
        },
        {
          name: 'datePicker',
          component: FormDatePickerComponent,
          wrappers: ['default'],
        },
        {
          name: 'textarea',
          component: FormTextAreaComponent,
          wrappers: ['default'],
        },
        {
          name: 'checkbox',
          component: FormCheckboxComponent,
          wrappers: ['default'],
        },
        {
          name: 'editor',
          component: FormRichTextEditorComponent,
          wrappers: ['default'],
        },
        {
          name: 'key-value',
          component: FormKeyValueInput,
          wrappers: ['default'],
        },
      ],
      validationMessages: [
        { name: 'required', message: () => 'common.error.required' },
        { name: 'minLength', message: () => 'common.error.minlength' },
        { name: 'maxLength', message: () => 'common.error.maxlength' },
        { name: 'min', message: () => 'common.error.min' },
        { name: 'max', message: () => 'common.error.max' },
        { name: 'pattern', message: () => 'common.error.pattern' },
        { name: 'email', message: () => 'common.error.email' },
      ],
      wrappers: [
        { name: 'default', component: FormControlComponent },
        { name: 'simple', component: FormControlSimpleComponent },
      ],
    }),
  ],
})
export class MixFormComponent<T> {
  @Input() public form!: FormGroup;
  public controls = contentChildren(FormControlComponent, {
    descendants: true,
  });

  public value = input<any>({});
  public formConfig = input<FormlyFieldConfig[]>([]);
  public formInternalEvent = inject(FormInternalEvent);

  public onSubmit = output<IFormSubmit<T>>();

  constructor() {
    this.formInternalEvent.formControlSubmitListener$
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        if (!value) return;

        this.onSubmit.emit({
          field: value?.field,
          newValue: value?.newValue,
          value: this.value(),
          resetControl: value?.resetControl,
        });
      });
  }
}
