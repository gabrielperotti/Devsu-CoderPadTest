import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { IProduct } from '../interfaces/product.interface';
import { environment } from '../../../environments/environment';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpTestingController: HttpTestingController;
  const baseUrl = `${environment.baseUrl}/bp/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    });
    service = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all products', () => {
    const mockProducts: IProduct[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: '2021-01-01', date_revision: '2022-01-01' },
      { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: '2021-02-01', date_revision: '2022-02-01' }
    ];

    service.getAll().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpTestingController.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should retrieve a single product by id', () => {
    const mockProducts: IProduct[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: '2021-01-01', date_revision: '2022-01-01' }
    ];

    service.getOne('1').subscribe(product => {
      expect(product).toEqual(mockProducts[0]);
    });

    const reqAll = httpTestingController.expectOne(baseUrl);
    expect(reqAll.request.method).toBe('GET');
    reqAll.flush(mockProducts);
  });

  it('should check product verification by id', () => {
    const mockVerification = true;

    service.verification('1').subscribe(isTaken => {
      expect(isTaken).toBe(mockVerification);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/verification?id=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockVerification);
  });

  it('should create a new product', () => {
    const newProduct: IProduct = { id: '3', name: 'Product 3', description: 'Description 3', logo: 'logo3.png', date_release: '2021-03-01', date_revision: '2022-03-01' };

    service.create(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });

    const req = httpTestingController.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(newProduct);
  });

  it('should update an existing product', () => {
    const updatedProduct: IProduct = { id: '1', name: 'Updated Product', description: 'Updated Description', logo: 'updated_logo.png', date_release: '2021-01-01', date_revision: '2022-01-01' };

    service.update(updatedProduct).subscribe(product => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpTestingController.expectOne(baseUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush(updatedProduct);
  });

  it('should delete a product', () => {
    service.delete('1').subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpTestingController.expectOne(`${baseUrl}?id=1`);
    expect(req.request.method).toBe('DELETE');
    req.flush('1', { status: 200, statusText: 'OK' });
  });

  it('should handle errors correctly', () => {
    const errorMessage = 'test 404 error';

    service.getAll().subscribe(
      () => fail('expected an error, not products'),
      (error: Error) => {
        expect(error.message).toContain('Server returned code: 404, error message is: test 404 error');
      }
    );

    const req = httpTestingController.expectOne(baseUrl);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
