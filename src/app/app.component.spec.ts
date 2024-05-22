import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ErrorService } from './shared/services/error.service';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';
import { RouterOutlet, RouterLink } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let errorService: ErrorService;
  let errorMessagesSubject: Subject<string>;

  beforeEach(async () => {
    errorMessagesSubject = new Subject<string>();
    const errorServiceStub = {
      getErrorMessages: jest.fn().mockReturnValue(errorMessagesSubject.asObservable())
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, RouterLink, RouterOutlet, AppComponent], // Importando el componente standalone directamente
      providers: [{ provide: ErrorService, useValue: errorServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    errorService = TestBed.inject(ErrorService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to error messages on init', () => {
    errorMessagesSubject.next('Test error message');
    fixture.detectChanges();

    expect(component.errorMsgs.length).toBe(1);
    expect(component.errorMsgs[0]).toBe('Test error message');
  });

  it('should add an error message when an error is emitted', () => {
    errorMessagesSubject.next('Another test error message');
    fixture.detectChanges();

    expect(component.errorMsgs.length).toBe(1);
    expect(component.errorMsgs[0]).toBe('Another test error message');
  });

  it('should remove an error message when closeMsg is called', () => {
    component.errorMsgs = ['Test error message 1', 'Test error message 2'];

    component.closeMsg(0);
    fixture.detectChanges();

    expect(component.errorMsgs.length).toBe(1);
    expect(component.errorMsgs[0]).toBe('Test error message 2');
  });

  it('should unsubscribe from error messages on destroy', () => {
    component.ngOnInit();
    const unsubscribeSpy = jest.spyOn(component.errorSubscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
