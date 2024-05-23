import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListPageComponent } from './product-list-page.component';
import { ProductsService } from '../../shared/services/products.service';
import { ErrorService } from '../../shared/services/error.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { IProduct } from '../../shared/interfaces/product.interface';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { ActionsDropdownComponent } from '../../shared/components/actions-dropdown/actions-dropdown.component';
import { ProductFilterPipe } from '../../shared/pipes/product-filter.pipe';

describe('ProductListPageComponent', () => {
  let component: ProductListPageComponent;
  let fixture: ComponentFixture<ProductListPageComponent>;
  let productsService: ProductsService;
  let errorService: ErrorService;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(async () => {
    const productsServiceStub = {
      getAll: jest.fn(),
      delete: jest.fn()
    };

    const errorServiceStub = {
      emitError: jest.fn(),
      getErrorMessages: jest.fn().mockReturnValue(of())
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CommonModule,
        FormsModule,
        ProductListPageComponent,
        ActionsDropdownComponent,
        ProductFilterPipe
      ],
      providers: [
        { provide: ProductsService, useValue: productsServiceStub },
        { provide: ErrorService, useValue: errorServiceStub },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    errorService = TestBed.inject(ErrorService);
    changeDetectorRef = TestBed.inject(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  

  it('should initialize the component and load products', async () => {
    const products: IProduct[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: '2021-01-01', date_revision: '2022-01-01' },
      { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: '2021-02-01', date_revision: '2022-02-01' }
    ];
    jest.spyOn(productsService, 'getAll').mockReturnValue(of(products));

    await component.initializeComponent();
    fixture.detectChanges();

    expect(component.products).toEqual(products);
    expect(component.productsCount).toBe(products.length);
  });

  
  it('should handle errors when loading products', async () => {
    jest.spyOn(productsService, 'getAll').mockReturnValue(throwError(() => new Error('Error getting products')));

    await component.initializeComponent();
    fixture.detectChanges();

    expect(errorService.emitError).toHaveBeenCalledWith('Error al obtener los productos');
  });

  it('should navigate to edit product page', () => {
    const routerSpy = jest.spyOn(component['_Router'], 'navigate');
    const product: IProduct = { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: '2021-01-01', date_revision: '2022-01-01' };

    component.onEdit(product);
    expect(routerSpy).toHaveBeenCalledWith(['/products', 'form'], { queryParams: { id: product.id } });
  });

  it('should delete a product', async () => {
    const product: IProduct = { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: '2021-01-01', date_revision: '2022-01-01' };
    jest.spyOn(productsService, 'delete').mockReturnValue(of(true));

    await component.onDelete(product);
    await component.confirmDelete();
    fixture.detectChanges();

    expect(productsService.delete).toHaveBeenCalledWith(product);
  });

  /*
  it('should handle errors when deleting a product', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    const product: IProduct = { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: '2021-01-01', date_revision: '2022-01-01' };
    jest.spyOn(productsService, 'delete').mockReturnValue(throwError(() => new Error('Error deleting product')));

    await component.onDelete(product);
    fixture.detectChanges();

    expect(errorService.emitError).toHaveBeenCalledWith('Error al eliminar producto');
  });
  */

  it('should update page when pageSize changes', () => {
    component.pageSize = 5;
    component.page = 2;

    component.onSizeChange(new Event('change'));
    fixture.detectChanges();

    expect(component.page).toBe(1);
  });

  it('should update page when page input changes', () => {
    component.page = 1;
    component.pageSize = 5;
    const products: IProduct[] = new Array(10).fill({ id: '1', name: 'Product', description: 'Description', logo: 'logo.png', date_release: '2021-01-01', date_revision: '2022-01-01' });
    component.products = products;

    component.onPageChange({ target: { value: 2 } });
    fixture.detectChanges();

    expect(component.page).toBe(2);
  });
  
  it('should not update page when input value is invalid', () => {
    component.page = 1;
    component.pageSize = 5;
    const products: IProduct[] = new Array(10).fill({ id: '1', name: 'Product', description: 'Description', logo: 'logo.png', date_release: '2021-01-01', date_revision: '2022-01-01' });
    component.products = products;

    component.onPageChange({ target: { value: 5 } });
    fixture.detectChanges();

    expect(component.page).toBe(2);
  });

  it('should reset to page 1 when search input changes', () => {
    component.page = 2;

    component.onSearchInput(new Event('input'));
    fixture.detectChanges();

    expect(component.page).toBe(1);
  });
  
  it('should paginate to previous page', () => {
    component.page = 2;

    component.prevPage();
    fixture.detectChanges();

    expect(component.page).toBe(1);
  });

  it('should paginate to next page', () => {
    component.page = 1;
    component.pageSize = 5;
    const products: IProduct[] = new Array(10).fill({ id: '1', name: 'Product', description: 'Description', logo: 'logo.png', date_release: '2021-01-01', date_revision: '2022-01-01' });
    component.products = products;

    component.nextPage();
    fixture.detectChanges();

    expect(component.page).toBe(2);
  });
});
