import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output, inject } from '@angular/core';

@Component({
  selector: 'app-actions-dropdown',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './actions-dropdown.component.html',
  styleUrl: './actions-dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsDropdownComponent implements OnInit {
  @Output('edit') edit = new EventEmitter();
  @Output('delete') delete = new EventEmitter();
  isOpen = false;
  private _ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor() { }

  ngOnInit(): void {
    
  }

  toggleDropdown(event: Event) {
    console.log('toggleDropdown');
    /* to avoid clickOutside trigger */
    setTimeout(() => {
      this.isOpen = !this.isOpen;
      this._ChangeDetectorRef.detectChanges();
    }, 0);
  }

  @HostListener('document:click', ['event'])
  clickOutside(event: Event) {
    console.log('clickOutside', this.isOpen)
    /* to avoid closing before opening */
    if (this.isOpen) this.isOpen = false;
    this._ChangeDetectorRef.detectChanges();
  }

  editItem() {
    this.edit.emit(true);
  }

  deleteItem() {
    this.delete.emit(true);
  }
}
