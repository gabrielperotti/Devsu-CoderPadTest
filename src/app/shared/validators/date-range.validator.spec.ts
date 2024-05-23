import { FormControl, FormGroup } from '@angular/forms';
import { dateRangeValidator } from './date-range.validator';

describe('dateRangeValidator', () => {
  it('should return null if dates are in the correct order', () => {
    const formGroup = new FormGroup({
      dateRelease: new FormControl('2023-01-01'),
      dateRevision: new FormControl('2023-01-02')
    });
    const validator = dateRangeValidator('dateRelease', 'dateRevision');
    expect(validator(formGroup)).toBeNull();
  });

  it('should return an error if dateRevision is before dateRelease', () => {
    const formGroup = new FormGroup({
      dateRelease: new FormControl('2023-01-02'),
      dateRevision: new FormControl('2023-01-01')
    });
    const validator = dateRangeValidator('dateRelease', 'dateRevision');
    expect(validator(formGroup)).toEqual({ dateRangeInvalid: true });
  });

  it('should return null if either dateRelease or dateRevision is missing', () => {
    const formGroup = new FormGroup({
      dateRelease: new FormControl('2023-01-01'),
      dateRevision: new FormControl('')
    });
    const validator = dateRangeValidator('dateRelease', 'dateRevision');
    expect(validator(formGroup)).toBeNull();
  });
});
