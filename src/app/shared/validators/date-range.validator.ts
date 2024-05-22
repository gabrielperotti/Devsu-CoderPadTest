import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(dateReleaseKey: string, dateRevisionKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as AbstractControl;
    const dateRelease = formGroup.get(dateReleaseKey)?.value;
    const dateRevision = formGroup.get(dateRevisionKey)?.value;

    if (!dateRelease || !dateRevision) { return null }

    const dateReleaseTime = new Date(dateRelease).getTime();
    const dateRevisionTime = new Date(dateRevision).getTime();

    return dateRevisionTime >= dateReleaseTime ? null : { dateRangeInvalid: true };
  };
}
