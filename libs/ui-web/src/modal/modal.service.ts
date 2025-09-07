import { Injectable, inject } from '@angular/core';
import { Observable, take } from 'rxjs';

import { DialogService } from '@ngneat/dialog';
import { ModalComponent, ModalType } from './modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public dialog = inject(DialogService);

  public show(
    message: string,
    title: string,
    type: ModalType = ModalType.Info,
  ): Observable<boolean> {
    const c = this.dialog.open(ModalComponent, {
      ...ModalComponent.dialogConfig,
      data: {
        title: title,
        message: message,
        type,
      },
    });

    return c.afterClosed$.pipe(take(1));
  }

  public confirm(
    message: string,
    options?: {
      okLabel?: string;
      cancelLabel?: string;
      title?: string;
    },
  ): Observable<boolean> {
    const c = this.dialog.open(ModalComponent, {
      ...ModalComponent.dialogConfig,
      data: {
        title: options?.title || 'Confirmation',
        okLabel: options?.okLabel,
        cancelLabel: options?.cancelLabel,
        message: message,
      },
    });

    return c.afterClosed$.pipe(take(1));
  }

  public info(
    message: string,
    title = 'Note',
    closeable = true,
  ): Observable<boolean> {
    const c = this.dialog.open(ModalComponent, {
      ...ModalComponent.dialogConfig,
      data: {
        title: title,
        message: message,
        type: ModalType.Info,
      },
      closeButton: closeable,
      enableClose: {
        backdrop: closeable,
        escape: closeable,
      },
    });

    return c.afterClosed$.pipe(take(1));
  }

  public success(message: string, title?: string): Observable<boolean> {
    const c = this.dialog.open(ModalComponent, {
      ...ModalComponent.dialogConfig,
      data: {
        title: title || 'Congratulation',
        message: message,
        type: ModalType.Success,
      },
    });

    return c.afterClosed$.pipe(take(1));
  }

  public error(message: string, title?: string): Observable<boolean> {
    const c = this.dialog.open(ModalComponent, {
      ...ModalComponent.dialogConfig,
      data: {
        title: title || 'Error',
        message: message,
        type: ModalType.Error,
      },
    });

    return c.afterClosed$.pipe(take(1));
  }

  public warning(message: string, title?: string): Observable<boolean> {
    const c = this.dialog.open(ModalComponent, {
      ...ModalComponent.dialogConfig,
      data: {
        title: title || 'Warning',
        message: message,
        type: ModalType.Warning,
      },
    });

    return c.afterClosed$.pipe(take(1));
  }

  public asKForAction(
    message: string,
    action: () => void,
    rejectAction?: () => void,
    options?: {
      okLabel?: string;
      cancelLabel?: string;
      title?: string;
    },
  ) {
    this.confirm(message, options).subscribe((ok) => {
      if (ok) {
        action();
      } else {
        if (rejectAction) rejectAction();
      }
    });
  }
}

export const injectModalService = () => {
  return inject(ModalService);
};
