import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new Subject<string>();

  constructor() { }

  emitError(message: string) {
    this.errorSubject.next(message);
  }

  getErrorMessages() {
    return this.errorSubject.asObservable();
  }
}
