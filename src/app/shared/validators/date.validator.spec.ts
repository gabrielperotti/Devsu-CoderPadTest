import { FormControl } from '@angular/forms';
import { dateValidator } from './date.validator';

describe('dateValidator', () => {
  it('should return null if the date is valid', () => {
    const control = new FormControl(new Date().toISOString());
    const validator = dateValidator();
    expect(validator(control)).toBeNull();
  });

  it('should return an error if the date is more than 24 hours in the past', () => {
    const control = new FormControl(new Date(Date.now() - 86400001).toISOString()); // 24 hours + 1 millisecond
    const validator = dateValidator();
    expect(validator(control)).toEqual({ dateInvalid: true });
  });
});
