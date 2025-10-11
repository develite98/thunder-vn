import { AbstractControl, ValidationErrors } from '@angular/forms';

export function requiredTrimValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (!control.value) return { required: true };

  const value = String(control.value);
  if (value.trim().length === 0) {
    return { required: true };
  }

  return null;
}
