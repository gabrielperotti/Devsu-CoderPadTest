import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IProduct } from '../../shared/interfaces/product.interface';
import { ProductsService } from '../../shared/services/products.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged, firstValueFrom, of, startWith, switchMap, tap } from 'rxjs';
import { ErrorService } from '../../shared/services/error.service';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form-page.component.html',
  styleUrl: './product-form-page.component.css'
})
export class ProductFormPageComponent implements OnInit, OnDestroy {
  public form!: UntypedFormGroup;
  public product!: IProduct | undefined;
  public submitted = false;
  public formValueChanged = false;

  private _ProductsService = inject(ProductsService);
  private _FormBuilder = inject(UntypedFormBuilder);
  private _Router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _ErrorService = inject(ErrorService);

  private _idInputChangeSub!: Subscription;
  private _formChangeSub!: Subscription;
  public _validIdInput = true;
  public _checkValidIdInput = false;

  constructor() { }

  ngOnInit(): void {
    this.initializeComponent();
  }

  async initializeComponent() {
    try {
      const id = this._route.snapshot.queryParamMap.get('id');
      this.product = id ? await firstValueFrom(this._ProductsService.getOne(id)) : undefined;
      this.buildForm();
    } catch (e) {
      console.log(e);
      this._ErrorService.emitError('Error al obtener el producto');
    }
  }

  get f() { return this.form.controls }
  buildForm() {
    const date_release = (this.product?.date_release ? new Date(this.product?.date_release) : new Date()).toISOString().substring(0, 10);
    const date_revision = (this.product?.date_revision ? new Date(this.product?.date_revision) : new Date()).toISOString().substring(0, 10);
    this.form = this._FormBuilder.group({
      id: [this.product?.id ?? '', Validators.required],
      name: [this.product?.name ?? '', Validators.required],
      description: [this.product?.description ?? '', Validators.required],
      logo: [this.product?.logo ?? '', Validators.required],
      date_release: [date_release, Validators.required],
      date_revision: [{ value: date_revision, disabled: true }, Validators.required],
    })

    this._formChangeSub = this.form.valueChanges.subscribe(() => {
      this.formValueChanged = true;
    });

    this._idInputChangeSub = this.f['id'].valueChanges
      .pipe(
        tap(el => this._checkValidIdInput = true),
        startWith(''),
        debounceTime(100),
        distinctUntilChanged(),
      )
      .subscribe(async newId => {
        try {
          this._validIdInput = newId ? !await firstValueFrom(this._ProductsService.verification(newId)) : false;
          this._checkValidIdInput = false;
        } catch (e) {
          this._ErrorService.emitError('Error al verificar id de producto');
        }
      })

    this.formValueChanged = !!this.product?.id;
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
      const subscription = this._ProductsService.update(data).subscribe({
        next: () => {
          this._Router.navigate(['/products', 'list']);
          subscription.unsubscribe();
        },
        error: () => {
          this._ErrorService.emitError("Error al modificar producto");
          subscription.unsubscribe();
        }
      })
    } else {
      const subscription = this._ProductsService.create(data).subscribe({
        next: () => {
          this._Router.navigate(['/']);
          subscription.unsubscribe();
        },
        error: () => {
          this._ErrorService.emitError("Error al crear producto");
          subscription.unsubscribe();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this._formChangeSub.unsubscribe();
    this._idInputChangeSub.unsubscribe();
  }
}
