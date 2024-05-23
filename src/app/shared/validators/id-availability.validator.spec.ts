import { FormControl } from '@angular/forms';
import { of, throwError, firstValueFrom } from 'rxjs';
import { idAvailabilityValidator } from './id-availability.validator';
import { ProductsService } from '../../shared/services/products.service';

describe('idAvailabilityValidator', () => {
  let productsService: jest.Mocked<ProductsService>;
  let setLoading: jest.Mock;

  beforeEach(() => {
    productsService = {
      verification: jest.fn()
    } as any;
    setLoading = jest.fn();
  });

  it('should return null if control value is empty or less than 3 characters', async () => {
    
    // mock
    jest.spyOn(productsService, 'verification').mockReturnValue(of(false));

    // do
    const control = new FormControl('');
    const validator = idAvailabilityValidator(productsService, setLoading);
    const result = await firstValueFrom(validator(control) as any);

    // eval
    expect(result).toBeNull();
    expect(setLoading).toHaveBeenCalledWith(false);

    // clear
    jest.spyOn(productsService, 'verification').mockClear();
  });

  it('should return { idTaken: true } if id is taken', async () => {
    productsService.verification.mockReturnValue(of(true));
    const control = new FormControl('test-id');
    const validator = idAvailabilityValidator(productsService, setLoading);
    const result = await firstValueFrom(validator(control) as any);
    expect(result).toEqual({ idTaken: true });
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it('should return null if id is not taken', async () => {
    productsService.verification.mockReturnValue(of(false));
    const control = new FormControl('test-id');
    const validator = idAvailabilityValidator(productsService, setLoading);
    const result = await firstValueFrom(validator(control) as any);
    expect(result).toBeNull();
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it('should handle errors and return null', async () => {
    productsService.verification.mockReturnValue(throwError(() => new Error('Error')));
    const control = new FormControl('test-id');
    const validator = idAvailabilityValidator(productsService, setLoading);
    const result = await firstValueFrom(validator(control) as any);
    expect(result).toBeNull();
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
  });
});
