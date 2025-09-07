import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MixIconComponent } from '@mixcore/ui/icons';
import { HotToastRef } from '@ngxpert/hot-toast';
import { Subject } from 'rxjs';

@Component({
  selector: 'custom-toast',
  templateUrl: './custom-toast.component.html',
  styles: [
    `
    .hot-toast-bar-base {
      position: relative;
      min-width: 350px !important;
    }

    .hot-toast-message {
      flex: unset !important;
    }

    .bg-success {
      background-color: var(--color-success);
    }
    .bg-error {
      background-color: var(--color-error, #dc3545);
    }
    .bg-info {
      background-color: var(--color-info, #17a2b8);
    }
    .bg-warning {
      background-color: var(--color-warning, #ffc107);
    }
    .bg-loading {
      background-color: #6c757d;
    }
    `
  ],
  imports: [MixIconComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})
export class CustomToastComponent {
  public toastRef = inject(HotToastRef<{message: string}>, { optional: true });
  public message = signal('');
  public type = signal('Loading');
  public observer = this.toastRef?.data?.observer as Subject<{type: string , message: string}> | null;

  constructor() {
    this.message.set(this.toastRef?.data?.message || '');
    this.type.set(this.toastRef?.data?.type || 'Loading');


    if (this.observer) {
      this.observer.pipe(takeUntilDestroyed()).subscribe((data) => {
        this.type.set(data.type);
        this.message.set(data.message);
      });
    }
  }


  get typeTitle() {
    switch (this.type().toLowerCase()) {
      case 'success': return 'Success!';
      case 'error': return 'Error!';
      case 'info': return 'Info!';
      case 'warning': return 'Warning!';
      case 'loading': return 'Progressing...';
      default: return '';
    }
  }
}
