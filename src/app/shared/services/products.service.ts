import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private _baseUrl = `${environment.baseUrl}/bp/products`;
  private _http = inject(HttpClient);

  constructor() { }

  getAll (): Observable<IProduct[]> {
    return this._http.get<IProduct[]>(this._baseUrl);
  }

  verification (product: IProduct | string): Observable<void> {
    const id = (typeof product == 'string') ? product : product.id;
    return this._http.get<void>(this._baseUrl + '/verification?id=' + id);
  }

  create (product: IProduct): Observable<IProduct> {
    return this._http.post<IProduct>(this._baseUrl, product);
  }

  update (product: IProduct): Observable<IProduct> {
    return this._http.put<IProduct>(this._baseUrl, product);
  }

  delete (product: IProduct | string): Observable<void> {
    const id = (typeof product == 'string') ? product : product.id;
    return this._http.delete<void>(this._baseUrl + '?id=' + id).pipe(
      map(el => {})
    );
  }
}
