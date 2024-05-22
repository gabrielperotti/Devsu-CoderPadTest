import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { ProductsService } from '../../shared/services/products.service';
import { catchError, finalize, map, tap, of, timeout } from 'rxjs';

export function idAvailabilityValidator(productsService: ProductsService, setLoading: (loading: boolean) => void): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value || control.value.length < 3) {
      setLoading(false);
      return of(null);
    }
    setLoading(true);
    return productsService.verification(control.value).pipe(
      tap(() => setLoading(true)),
      map(isTaken => (isTaken ? { idTaken: true } : null)),
      catchError(() => of(null)),
      finalize(() => setLoading(false))
    );
  };
}