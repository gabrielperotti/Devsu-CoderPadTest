import { Routes } from '@angular/router';
import { ProductListPageComponent } from './pages/product-list-page/product-list-page.component';
import { ProductFormPageComponent } from './pages/product-form-page/product-form-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'product/list', pathMatch: 'full' },
  { path: 'products/list', component: ProductListPageComponent },
  { path: 'products/form', component: ProductFormPageComponent },
  { path: '**', pathMatch: 'full', component: NotFoundPageComponent }
];
