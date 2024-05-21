import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IProduct } from '../../shared/interfaces/product.interface';
import { ProductsService } from '../../shared/services/products.service';
import { firstValueFrom } from 'rxjs';
import { ActionsDropdownComponent } from '../../shared/components/actions-dropdown/actions-dropdown.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ProductFilterPipe } from '../../shared/pipes/product-filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ActionsDropdownComponent, RouterLink, RouterModule, ProductFilterPipe],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css'
})
export class ProductListPageComponent implements OnInit {
  public productSearch: string = '';
  public products!: IProduct[];
  private _ProductsService = inject(ProductsService);
  private _Router = inject(Router);

  constructor() { }

  ngOnInit(): void {
    this.initializeComponent();
  }

  initializeComponent() {
    this.getProducts();
  }

  async getProducts() {
    try {
      this.products = [];
      this.products = await firstValueFrom(this._ProductsService.getAll());
    } catch (e) {
      console.log(e);
      alert('error fetching data');
    }
  }

  onEdit(product: IProduct) {
    this._Router.navigate(['/products', 'form'], { queryParams: { id: product.id } })
  }

  onDelete(product: IProduct) {
    if (confirm('Desea eliminar este producto?')) {
      this._ProductsService.delete(product).subscribe({
        next: async () => await this.getProducts(),
        error: async () => await this.getProducts()
      });
    }
  }
}
