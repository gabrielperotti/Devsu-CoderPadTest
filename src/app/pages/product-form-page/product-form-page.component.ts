import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IProduct } from '../../shared/interfaces/product.interface';
import { ProductsService } from '../../shared/services/products.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { ErrorService } from '../../shared/services/error.service';
import { idAvailabilityValidator } from '../../shared/validators/id-availability.validator';
import { dateValidator } from '../../shared/validators/date.validator';
import { dateRangeValidator } from '../../shared/validators/date-range.validator';
import { FormSkeletonComponent } from '../../shared/components/form-skeleton/form-skeleton.component';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormSkeletonComponent],
  templateUrl: './product-form-page.component.html',
  styleUrl: './product-form-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormPageComponent implements OnInit, OnDestroy {
  public form!: UntypedFormGroup;
  public product!: IProduct | undefined;
  public submitted = false;
  public formValueChanged = false;
  public isLoading = false;

  private _ProductsService = inject(ProductsService);
  private _FormBuilder = inject(UntypedFormBuilder);
  private _Router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _ErrorService = inject(ErrorService);
  private _ChangeDetectorRef = inject(ChangeDetectorRef);

  private _formChangeSub!: Subscription;
  private _dateReleaseChangeSub!: Subscription;
  public _validIdInput = true;
  public _checkValidIdInput = false;

  constructor() { }

  ngOnInit(): void {
    this.initializeComponent();
  }

  async initializeComponent() {
    this.isLoading = true;
    try {
      const id = this._route.snapshot.queryParamMap.get('id');
      this.product = id ? await firstValueFrom(this._ProductsService.getOne(id)) : undefined;
      this.buildForm();
    } catch (e) {
      // console.log(e);
      this._ErrorService.emitError('Error al obtener el producto');
      this._ChangeDetectorRef.markForCheck();
    }
    this.isLoading = false;
  }

  checkValidIdInput(loading: boolean) {
    this._checkValidIdInput = loading;
    this._ChangeDetectorRef.markForCheck();
  }

  get f() { return this.form.controls }

  buildForm() {
    const date_release = (this.product?.date_release ? new Date(this.product?.date_release) : new Date()).toISOString().substring(0, 10);
    const date_revision = (this.product?.date_revision ? new Date(this.product?.date_revision) : new Date()).toISOString().substring(0, 10);
    const idValidators: any = { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)] };
    if (!this.product) {
      idValidators.asyncValidators = [idAvailabilityValidator(this._ProductsService, this.checkValidIdInput.bind(this))];
      idValidators.updateOn = 'change';
    }
    this.form = this._FormBuilder.group({
      id: [this.product?.id ?? '', idValidators],
      name: [this.product?.name ?? '', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      description: [this.product?.description ?? '', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(200)])],
      logo: [this.product?.logo ?? '', Validators.required],
      date_release: [date_release, Validators.compose([Validators.required, dateValidator()])],
      date_revision: [{ value: date_revision, disabled: true }, Validators.required],
    }, {
      validators: dateRangeValidator('date_release', 'date_revision')
    });

    this._formChangeSub = this.form.valueChanges.subscribe(() => {
      this.formValueChanged = true;
      this._ChangeDetectorRef.markForCheck();
    });

    this._dateReleaseChangeSub = this.f['date_release'].valueChanges.subscribe(value => {
      if (value) {
        const newDate = new Date(value);
        newDate.setFullYear(newDate.getFullYear() + 1);
        this.f['date_revision'].setValue(newDate.toISOString().substring(0, 10), { emitEvent: false });
        this._ChangeDetectorRef.markForCheck();
      }
    });

    this.formValueChanged = !!this.product?.id;
    this._ChangeDetectorRef.markForCheck();
  }

  return() {
    this._Router.navigate(['/products', 'list']);
  }

  reset() {
    this.form.reset();
    this.formValueChanged = false;
    this._ChangeDetectorRef.markForCheck();
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
          this._ChangeDetectorRef.markForCheck();
        },
        error: () => {
          this._ErrorService.emitError("Error al modificar producto");
          subscription.unsubscribe();
          this._ChangeDetectorRef.markForCheck();
        }
      });
    } else {
      const subscription = this._ProductsService.create(data).subscribe({
        next: () => {
          this._Router.navigate(['/']);
          // subscription.unsubscribe();
          // this._ChangeDetectorRef.markForCheck();
        },
        error: () => {
          this._ErrorService.emitError("Error al crear producto");
          // subscription.unsubscribe();
          this._ChangeDetectorRef.markForCheck();
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this._formChangeSub) this._formChangeSub.unsubscribe();
    if (this._dateReleaseChangeSub) this._dateReleaseChangeSub.unsubscribe();
  }
}
