import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private _baseUrl = `${environment.baseUrl}/bp/products`;
  private _http = inject(HttpClient);

  constructor() { }

  getAll(): Observable<IProduct[]> {
    return this._http.get<IProduct[]>(this._baseUrl);
  }

  /* refactor: ask for right endpoint */
  getOne(product: IProduct | string): Observable<IProduct> {
    const id = (typeof product == 'string') ? product : product.id;
    return this.getAll().pipe(
      map((products: IProduct[]) => products.find(p => p.id === id) as IProduct),
      catchError(this.handleError)
    )
  }

  verification(product: IProduct | string): Observable<boolean> {
    const id = (typeof product == 'string') ? product : product.id;
    return this._http.get<boolean>(this._baseUrl + '/verification?id=' + id).pipe(
      catchError(this.handleError)
    );
  }

  create(product: IProduct): Observable<IProduct> {
    return this._http.post<IProduct>(this._baseUrl, product).pipe(
      catchError(this.handleError)
    );
  }

  update(product: IProduct): Observable<IProduct> {
    return this._http.put<IProduct>(this._baseUrl, product).pipe(
      catchError(this.handleError)
    );
  }

  delete(product: IProduct | string): Observable<any> {
    const id = (typeof product == 'string') ? product : product.id;
    return this._http.delete(this._baseUrl + '?id=' + id, { responseType: 'text' }).pipe(
      map(el => true),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = (error.error instanceof ErrorEvent) ?
      `An error occurred: ${error.error.message}` :
      `Server returned code: ${error.status}, error message is: ${error.message}`;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
