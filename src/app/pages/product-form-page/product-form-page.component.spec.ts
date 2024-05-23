import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ProductFormPageComponent } from './product-form-page.component';
import { ProductsService } from '../../shared/services/products.service';
import { ErrorService } from '../../shared/services/error.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule, UntypedFormControl, ValidationErrors, UntypedFormGroup, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { IProduct } from '../../shared/interfaces/product.interface';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

describe('ProductFormPageComponent', () => {
  let component: ProductFormPageComponent;
  let fixture: ComponentFixture<ProductFormPageComponent>;
  let productsService: ProductsService;
  let errorService: ErrorService;
  let changeDetectorRef: ChangeDetectorRef;
  let mockActivatedRoute: { snapshot: any; };

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        queryParamMap: {
          get: jest.fn()
        }
      }
    };

    const productsServiceStub = {
      getOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      verification: jest.fn()
    };

    const errorServiceStub = {
      emitError: jest.fn(),
      getErrorMessages: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        FormsModule,
        ProductFormPageComponent, // Importando el componente standalone directamente
      ],
      providers: [
        { provide: ProductsService, useValue: productsServiceStub },
        { provide: ErrorService, useValue: errorServiceStub },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormPageComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    errorService = TestBed.inject(ErrorService);
    changeDetectorRef = TestBed.inject(ChangeDetectorRef);
    // fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Resetea todos los mocks después de cada prueba
    jest.restoreAllMocks(); // Restaura todos los mocks a su implementación original
  });

  it('should create', () => {

    // init
    fixture.detectChanges();

    // eval
    expect(component).toBeTruthy();
  });

  it('should initialize the component and build the form', waitForAsync(async () => {

    // mock
    const product: IProduct = {
      id: 'item-001', name: 'Product 1', description: 'Description 1',
      logo: 'logo1.png', date_release: '2021-01-01', date_revision: '2022-01-01'
    };
    jest.spyOn(productsService, 'getOne').mockReturnValue(of(product));
    mockActivatedRoute.snapshot.queryParamMap.get.mockReturnValue('item-001');

    // init
    fixture.detectChanges();
    await fixture.whenStable();

    // eval
    expect(component.product).toEqual(product);
    expect(component.form).toBeTruthy();
    expect(component.form.controls['id'].value).toBe(product.id);
    expect(component.form.controls['name'].value).toBe(product.name);

    // clear
    jest.spyOn(productsService, 'getOne').mockClear();
    mockActivatedRoute.snapshot.queryParamMap.get.mockClear();
  }));

  it('should add a new product', waitForAsync(async () => {

    // mock
    const today = new Date(), nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    const newProduct: IProduct = {
      id: 'item-002', name: 'Product 2', description: 'Description 2', logo: 'logo2.png',
      date_release: today.toISOString(), date_revision: nextYear.toISOString()
    };
    const mockIdAvailabilityValidator = jest.fn().mockReturnValue(of(null));
    mockActivatedRoute.snapshot.queryParamMap.get.mockReturnValue(null);
    jest.spyOn(productsService, 'create').mockReturnValue(of(newProduct));
    const navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');

    // init
    fixture.detectChanges();
    component.form.controls['id'].setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(10)]);
    component.form.controls['id'].setAsyncValidators([mockIdAvailabilityValidator]);
    component.form.controls['id'].updateValueAndValidity({ onlySelf: true, emitEvent: true });
    component.form.controls['date_revision'].enable();
    component.form.setValue(newProduct);
    // getFormValidationErrors(component.form);
    await fixture.whenStable();
    console.log('onCreate');
    component.onSubmit();
    await fixture.whenStable();

    // eval
    expect(component.form.valid).toBe(true);
    expect(productsService.create).toHaveBeenCalledWith(newProduct);
    expect(navigateSpy).toHaveBeenCalledWith(['/']);

    // clear
    mockActivatedRoute.snapshot.queryParamMap.get.mockClear();
    jest.spyOn(productsService, 'create').mockClear();
  }));

  it('should update an existing product', waitForAsync(async () => {

    // mock
    const today = new Date(), nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    const originalProduct: IProduct = {
      id: 'item-003', name: 'Product 3', description: 'Description 3', logo: 'logo3.png',
      date_release: today.toISOString(), date_revision: nextYear.toISOString()
    };
    jest.spyOn(productsService, 'getOne').mockReturnValue(of(originalProduct));
    mockActivatedRoute.snapshot.queryParamMap.get.mockReturnValue('item-003');

    const updatedProduct: IProduct = {
      id: 'item-003', name: 'Product 3', description: 'Description 3 UPDATED', logo: 'logo2.png',
      date_release: today.toISOString(), date_revision: nextYear.toISOString()
    };
    jest.spyOn(productsService, 'update').mockReturnValue(of(updatedProduct));
    const navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');

    // init
    fixture.detectChanges();
    await fixture.whenStable();
    component.product = originalProduct;
    component.form.controls['date_revision'].enable();
    component.form.setValue(updatedProduct);
    await fixture.whenStable();
    console.log('onUpdate');
    component.onSubmit();
    await fixture.whenStable();

    // eval
    expect(component.form.valid).toBe(true);
    expect(productsService.update).toHaveBeenCalledWith(updatedProduct);
    expect(navigateSpy).toHaveBeenCalledWith(['/products', 'list']);

    // clear
    mockActivatedRoute.snapshot.queryParamMap.get.mockClear();
    jest.spyOn(productsService, 'getOne').mockClear();
    jest.spyOn(productsService, 'update').mockClear();
  }));
});

const getFormValidationErrors = (form: UntypedFormGroup) => {
  Object.keys(form.controls).forEach(key => {
    const controlErrors: any = form.get(key)?.errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach(keyError => {
        console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
      });
    }
  });
}