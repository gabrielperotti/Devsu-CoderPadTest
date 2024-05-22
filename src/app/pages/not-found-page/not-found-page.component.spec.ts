import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundPageComponent } from './not-found-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('NotFoundPageComponent', () => {
  let component: NotFoundPageComponent;
  let fixture: ComponentFixture<NotFoundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NotFoundPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const titleElement: HTMLElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(titleElement.textContent).toContain('404 - Página no encontrada');
  });

  it('should have a button to return to the home page', () => {
    const buttonElement = fixture.debugElement.query(By.css('button.return'));
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.attributes['ng-reflect-router-link']).toBe('/');
  });
});
