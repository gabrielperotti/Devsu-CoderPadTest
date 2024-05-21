import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';

@Pipe({
  name: 'productFilter',
  pure: false,
  standalone: true
})
export class ProductFilterPipe implements PipeTransform {

  transform(products: IProduct[], args: any[]): IProduct[] {
    let [filterString, page, pageSize] = args;
    if (!products) return [];
    // if (!filterString) return products;
    const words = filterString.toLowerCase().split(" ");
    const filteredProducts = products.filter(product => {
      return words.some((word: string) =>
        product.name?.toLowerCase().includes(word) ||
        product.description?.toLowerCase().includes(word)
      );
    });
    const index = (page - 1) * +pageSize;
    return filteredProducts.slice(index, index + +pageSize);
  }
}
