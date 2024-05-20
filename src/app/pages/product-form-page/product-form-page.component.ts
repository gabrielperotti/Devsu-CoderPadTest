import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IProduct } from '../../shared/interfaces/product.interface';
import { ProductsService } from '../../shared/services/products.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form-page.component.html',
  styleUrl: './product-form-page.component.css'
})
export class ProductFormPageComponent implements OnInit {
  public form!: UntypedFormGroup;
  public product!: IProduct;
  public submitted = false;
  public formValueChanged = false;

  private _ProductsService = inject(ProductsService);
  private _FormBuilder = inject(UntypedFormBuilder);
  private _Router = inject(Router);

  constructor() { }

  ngOnInit(): void {
    this.initializeComponent();
  }

  async initializeComponent() {
    try {
      this.buildForm();
    } catch (e) {
      console.log(e);
      alert('error fetching data');
    }
  }

  get f() { return this.form.controls }
  buildForm() {
    const now = new Date();
    this.form = this._FormBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      logo: ['', Validators.required],
      date_release: [now, Validators.required],
      date_revision: [{ value: now, disabled: true }, Validators.required],
    })

    this.form.valueChanges.subscribe(() => {
      this.formValueChanged = true;
    });
  }

  return() {
    this._Router.navigate(['/products', 'list']);
  }

  reset() {
    this.form.reset();
    this.formValueChanged = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    const data: IProduct = this.form.value;
    data.date_release = (data.date_release ? new Date(data.date_release) : new Date()).toISOString();
    data.date_revision = (data.date_revision ? new Date(data.date_revision) : new Date()).toISOString();
    if (this.product) {
      const subscription = this._ProductsService.update(data).subscribe(() => {
        this._Router.navigate(['/products', 'list']);
        subscription.unsubscribe();
      })
    } else {
      const subscription = this._ProductsService.create(data).subscribe(() => {
        this._Router.navigate(['/']);
        subscription.unsubscribe();
      })
    }
  }
}
