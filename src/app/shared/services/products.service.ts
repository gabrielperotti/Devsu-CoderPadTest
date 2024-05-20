import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private _baseUrl = `${environment.baseUrl}/bp/products`;
  private _http = inject(HttpClient);

  constructor() { }

  getAll () {
    return this._http.get(this._baseUrl);
  }
}
