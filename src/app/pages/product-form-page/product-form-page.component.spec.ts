import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormPageComponent } from './product-form-page.component';
import { ProductsService } from '../../shared/services/products.service';
import { ErrorService } from '../../shared/services/error.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { IProduct } from '../../shared/interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ProductFormPageComponent', () => {
  let component: ProductFormPageComponent;
  let fixture: ComponentFixture<ProductFormPageComponent>;
  let productsService: ProductsService;
  let errorService: ErrorService;
  let mockActivatedRoute;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        queryParamMap: {
          get: jest.fn().mockReturnValue('1')
        }
      }
    };

    const productsServiceStub = {
      getOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      verification: jest.fn().mockReturnValue(of(false))
    };

    const errorServiceStub = {
      emitError: jest.fn(),
      getErrorMessages: jest.fn().mockReturnValue(of())
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule, ProductFormPageComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceStub },
        { provide: ErrorService, useValue: errorServiceStub },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormPageComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    errorService = TestBed.inject(ErrorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle errors when initializing the component', async () => {
    jest.spyOn(productsService, 'getOne').mockReturnValue(throwError(() => new Error('Error getting product')));

    await component.initializeComponent();
    fixture.detectChanges();

    expect(errorService.emitError).toHaveBeenCalledWith('Error al obtener el producto');
  });
});
