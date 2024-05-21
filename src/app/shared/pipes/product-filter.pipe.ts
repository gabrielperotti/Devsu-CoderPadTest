import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';

@Pipe({
  name: 'productFilter',
  standalone: true
})
export class ProductFilterPipe implements PipeTransform {

  transform(products: IProduct[], filterString: string): IProduct[] {
    if (!products) return [];
    if (!filterString) return products;
    const words = filterString.toLowerCase().split(" ");
    return products.filter(product => {
      return words.some(word => 
        product.name?.toLowerCase().includes(word) ||
        product.description?.toLowerCase().includes(word)
      );
    });
  }
}
