import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionsDropdownComponent } from './actions-dropdown.component';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('ActionsDropdownComponent', () => {
  let component: ActionsDropdownComponent;
  let fixture: ComponentFixture<ActionsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ActionsDropdownComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
  it('should toggle dropdown open state when button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', new Event('click'));
    fixture.detectChanges();

    expect(component.isOpen).toBe(true);

    button.triggerEventHandler('click', new Event('click'));
    fixture.detectChanges();

    expect(component.isOpen).toBe(false);
  });
  */

  it('should close dropdown when clicking outside', () => {
    component.isOpen = true;
    fixture.detectChanges();

    document.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.isOpen).toBe(false);
  });

  it('should emit edit event when editItem is called', () => {
    jest.spyOn(component.edit, 'emit');

    component.editItem();

    expect(component.edit.emit).toHaveBeenCalledWith(true);
  });

  it('should emit delete event when deleteItem is called', () => {
    jest.spyOn(component.delete, 'emit');

    component.deleteItem();

    expect(component.delete.emit).toHaveBeenCalledWith(true);
  });

  it('should not close the dropdown when clicking the button', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', new Event('click'));
    fixture.detectChanges();

    expect(component.isOpen).toBe(true);
  });

  /*
  it('should render dropdown menu when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const dropdownMenu = fixture.debugElement.query(By.css('.dropdown-menu'));
    expect(dropdownMenu).toBeTruthy();
  });
  */

  it('should not render dropdown menu when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();

    const dropdownMenu = fixture.debugElement.query(By.css('.dropdown-menu'));
    expect(dropdownMenu).toBeFalsy();
  });
});
