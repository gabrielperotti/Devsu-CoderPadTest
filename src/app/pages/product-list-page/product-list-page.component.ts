import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { IProduct } from '../../shared/interfaces/product.interface';
import { ProductsService } from '../../shared/services/products.service';
import { firstValueFrom } from 'rxjs';
import { ActionsDropdownComponent } from '../../shared/components/actions-dropdown/actions-dropdown.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ProductFilterPipe } from '../../shared/pipes/product-filter.pipe';
import { FormsModule } from '@angular/forms';
import { ErrorService } from '../../shared/services/error.service';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ActionsDropdownComponent, RouterLink, RouterModule, ProductFilterPipe],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListPageComponent implements OnInit {
  public productSearch: string = '';
  public products!: IProduct[];
  public productsCount = 0;
  public filteredProducts!: IProduct[];
  private _ProductsService = inject(ProductsService);
  private _Router = inject(Router);
  private _ChangeDetectorRef = inject(ChangeDetectorRef);
  private _ErrorService = inject(ErrorService);

  public page = 1;
  public pageSizes = [5, 10, 20];
  public pageSize = 10;

  constructor() { }

  ngOnInit(): void {
    this.initializeComponent();
  }

  async initializeComponent() {
    await this.getProducts();
    this._ChangeDetectorRef.detectChanges();
  }

  async getProducts() {
    try {
      this.products = [];
      this.products = await firstValueFrom(this._ProductsService.getAll());
      this.productsCount = this.products.length;
    } catch (e) {
      this._ErrorService.emitError('Error al obtener los productos');
    }
  }

  onEdit(product: IProduct) {
    this._Router.navigate(['/products', 'form'], { queryParams: { id: product.id } })
  }

  onDelete(product: IProduct) {
    if (confirm('Desea eliminar este producto?')) {
      const subscription: any = this._ProductsService.delete(product).subscribe({
        next: async () => {
          await this.getProducts();
          subscription.unsubscribe();
        },
        error: async () => {
          this._ErrorService.emitError('Error al eliminar producto');
          subscription.unsubscribe();
        }
      });
    }
  }

  onSearchInput(event: Event) {
    this.page = 1;
    this.pageSize = 10;
  }

  onSizeChange(event: Event) {
    this.page = 1;
  }

  onPageChange(event: any) {
    const newPage = event.target.value;
    const maxPage = Math.ceil(this.products.length / this.pageSize);
    try {
      this.page = newPage <= 1 ? 1 :
        newPage >= maxPage ? maxPage :
          event.target.value;
    } catch (e) { this.page = 1 }
  }

  prevPage() {
    this.page = this.page <= 1 ? 1 : --this.page;
  }

  nextPage() {
    const maxPage = Math.ceil(this.products.length / this.pageSize);
    this.page = this.page >= maxPage ? maxPage : ++this.page;
  }
}
