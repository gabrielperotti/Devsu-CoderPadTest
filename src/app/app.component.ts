import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductsService } from './shared/services/products.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private _ProductsService = inject(ProductsService);

  constructor() { }

  ngOnInit(): void {
    this.initializeComponent();
  }

  async initializeComponent() {
    try {
      this._ProductsService.getAll().subscribe({
        next: products => console.log(products)
      });
    } catch (e) {
      console.log(e);
      alert('error trying to initialize');
    }
  }
}
