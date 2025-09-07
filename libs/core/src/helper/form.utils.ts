import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

export class FormUtils {
  public static validateForm(
    toValidateForm: FormGroup | FormControl | AbstractControl,
  ): boolean {
    if (toValidateForm instanceof FormControl) {
      toValidateForm.markAsDirty();
      toValidateForm.markAsTouched();
      toValidateForm.updateValueAndValidity({ onlySelf: true });

      return toValidateForm.valid;
    }

    const form = toValidateForm as FormGroup;

    if (!form.controls) {
      return form.valid;
    }

    Object.values(form.controls).forEach((control: AbstractControl) => {
      if (control.invalid) {
        control.markAsDirty();
        control.markAsTouched();
        control.updateValueAndValidity({ onlySelf: true });
      }

      if (control instanceof FormArray)
        control.controls.some(
          (form: AbstractControl) => !FormUtils.validateForm(form as FormGroup),
        );
    });

    return form.valid;
  }

  public static validateForm$(
    toValidateForm: FormGroup | FormControl | AbstractControl,
  ): Promise<boolean | ReturnType<typeof toValidateForm.getRawValue>> {
    return new Promise<boolean>((resolve, reject) => {
      const valid = FormUtils.validateForm(toValidateForm);
      if (valid) {
        resolve(toValidateForm.getRawValue());
      } else {
        reject(false);
      }
    });
  }
}
