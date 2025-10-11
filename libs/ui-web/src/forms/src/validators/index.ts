import { AbstractControl, ValidationErrors } from '@angular/forms';
import { requiredTrimValidator } from './required.validator';

export class MixValidator {
  static requiredTrimmed(control: AbstractControl): ValidationErrors | null {
    return requiredTrimValidator(control);
  }

  static missmatchFields(
    field1: string,
    field2: string,
    errorKey = 'passwordMismatch',
  ) {
    return (group: AbstractControl): ValidationErrors | null => {
      const control1 = group.get(field1);
      const control2 = group.get(field2);

      if (!control1 || !control2) return null;

      if (control1.value === control2.value) {
        control2.updateValueAndValidity({ onlySelf: true });
        control2.setErrors(null);
        return null;
      }

      control2.setErrors({ [errorKey]: true });

      return null;
    };
  }
}
