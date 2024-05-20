import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IProduct } from '../../shared/interfaces/product.interface';
import { ProductsService } from '../../shared/services/products.service';
import { firstValueFrom } from 'rxjs';
import { ActionsDropdownComponent } from '../../shared/components/actions-dropdown/actions-dropdown.component';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, ActionsDropdownComponent, RouterLink, RouterModule],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css'
})
export class ProductListPageComponent implements OnInit {
  public products!: IProduct[];
  private _ProductsService = inject(ProductsService);
  private _Router = inject(Router);

  constructor() { }

  ngOnInit(): void {
    this.initializeComponent();
  }

  async initializeComponent() {
    try {
      this.products = await firstValueFrom(this._ProductsService.getAll());
    } catch (e) {
      console.log(e);
      alert('error fetching data');
    }
  }

  onEdit(product: IProduct) {
    this._Router.navigate(['/products', 'form'], {queryParams: {id: product.id}})
  }

  onDelete(product: IProduct) {
    console.log(product);
  }
}
