import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IProduct } from '../../shared/interfaces/product.interface';
import { ProductsService } from '../../shared/services/products.service';
import { firstValueFrom } from 'rxjs';
import { ActionsDropdownComponent } from '../../shared/components/actions-dropdown/actions-dropdown.component';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, ActionsDropdownComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css'
})
export class ProductListPageComponent implements OnInit {
  private _ProductsService = inject(ProductsService);
  public products!: IProduct[];

  constructor() { }

  ngOnInit(): void {
    this.initializeComponent();
  }

  async initializeComponent() {
    try {
      const date = new Date();
      const tmp = date.getTime().toString();
      this.products = await firstValueFrom(this._ProductsService.getAll());
      console.log(this.products);
    } catch (e) {
      console.log(e);
      alert('error fetching data');
    }
  }

  onEdit(product: IProduct) {
    console.log(product);
  }

  onDelete(product: IProduct) {
    console.log(product);
  }
}
