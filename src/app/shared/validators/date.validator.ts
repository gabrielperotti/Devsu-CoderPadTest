import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const date = new Date(control.value).getTime();
    const now = new Date().getTime();
    if (date <= (now - 86400000)) { // 24hs before now
      return { dateInvalid: true };
    }
    return null;
  };
}