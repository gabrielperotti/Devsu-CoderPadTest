import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const request = req.clone({
    setHeaders: {
      authorId: '1'
    }
  })
  return next(request);
};
