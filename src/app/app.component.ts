import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ErrorService } from './shared/services/error.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  errorMsgs: string[] = [];
  private _ErrorService = inject(ErrorService);
  private errorSubscription!: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.initializeComponent();
  }

  async initializeComponent() {
    this.errorSubscription = this._ErrorService.getErrorMessages().subscribe(
      message => {
        this.errorMsgs.push(message);
      }
    );
  }

  closeMsg(i: number) {
    this.errorMsgs.splice(i, 1);
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
