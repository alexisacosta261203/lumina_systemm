import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');

    if (value.trim().length === 0) {
      return { whitespace: true };
    }

    return null;
  };
}