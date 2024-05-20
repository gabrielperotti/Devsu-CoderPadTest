import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductsService } from './shared/services/products.service';
import { IProduct } from './shared/interfaces/product.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private _ProductsService = inject(ProductsService);
  private products: IProduct[] = [];

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
}
