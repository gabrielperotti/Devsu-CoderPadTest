import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-actions-dropdown',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './actions-dropdown.component.html',
  styleUrl: './actions-dropdown.component.css'
})
export class ActionsDropdownComponent {
  @Output('edit') edit = new EventEmitter();
  @Output('delete') delete = new EventEmitter();
  isOpen = false;

  constructor() { }

  toggleDropdown(event: Event) {
    /* to avoid clickOutside trigger */
    setTimeout(() => this.isOpen = !this.isOpen, 0);
  }

  @HostListener('document:click', ['event'])
  clickOutside(event: Event) {
    /* to avoid closing before opening */
    if (this.isOpen) this.isOpen = false;
  }

  editItem() {
    this.edit.emit(true);
  }

  deleteItem() {
    this.delete.emit(true);
  }
}
