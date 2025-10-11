import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchFieldsValidator(
  field1: string,
  field2: string,
  errorKey = 'passwordMismatch',
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control1 = group.get(field1);
    const control2 = group.get(field2);

    if (!control1 || !control2) return null;

    return control1.value === control2.value ? null : { [errorKey]: true };
  };
}

// this.form = this.fb.group(
//   {
//     password: ['', [Validators.required, Validators.minLength(6)]],
//     confirmPassword: ['', [Validators.required]],
//   },
//   { validators: matchFieldsValidator('password', 'confirmPassword') }
// );
