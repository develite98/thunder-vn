import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

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

    const invalidItem = Object.values(form.controls).find(
      (control: AbstractControl) => !control.valid,
    );

    if (invalidItem) {
      invalidItem.markAsDirty();
      invalidItem.markAsTouched();
      invalidItem.updateValueAndValidity({ onlySelf: true });
    }

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
