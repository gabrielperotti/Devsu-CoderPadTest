import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.css'
})
export class ImageModalComponent {
  @Input() imageUrl: string = '';
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
