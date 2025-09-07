import { AsyncPipe } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';

import { isObject, TranslocoPipe } from '@jsverse/transloco';
import { FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';

import {
  filter,
  isObservable,
  merge,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'form-validation-message',
  template: `
    <span class="text-error text-sm">
      {{ errorMessage$ | async | transloco }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, TranslocoPipe],
})
export class FormValidationMessage implements OnChanges {
  @Input() field!: FormlyFieldConfig;
  public errorMessage$!: Observable<string | undefined>;

  constructor(private readonly config: FormlyConfig) {}

  ngOnChanges() {
    const formControl = this.field.formControl;
    if (!formControl) return;

    this.errorMessage$ = merge(
      formControl.statusChanges,
      this.field.options?.fieldChanges?.pipe(
        filter(({ field }) => field === this.field),
      ) ?? of(null),
    ).pipe(
      startWith(null),
      switchMap(() =>
        isObservable(this.errorMessage)
          ? this.errorMessage
          : of(this.errorMessage),
      ),
    );
  }

  public get errorMessage() {
    const fieldForm = this.field.formControl;
    for (const error in fieldForm?.errors) {
      if (Object.prototype.hasOwnProperty.call(fieldForm.errors, error)) {
        let message = this.config.getValidatorMessage(error);

        if (isObject(fieldForm.errors[error])) {
          if (fieldForm.errors[error]['errorPath']) {
            return undefined;
          }

          if (fieldForm.errors[error]['message']) {
            message = fieldForm.errors[error]['message'] as string;
          }
        }

        if (this.field.validation?.messages?.[error]) {
          message = this.field.validation.messages[error];
        }

        if (this.field.validators?.[error]?.message) {
          message = this.field.validators[error].message;
        }

        if (this.field.asyncValidators?.[error]?.message) {
          message = this.field.asyncValidators[error].message;
        }

        if (typeof message === 'function') {
          return message(fieldForm.errors[error], this.field);
        }

        return message;
      }
    }

    return undefined;
  }
}
