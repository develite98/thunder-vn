import { Injectable, inject } from '@angular/core';

import { injectBottomSheet } from '@mixcore/ui-mobile/bottom-sheet';
import { ModalButton, ModalComponent } from './modal.component';

export interface ICustomModalOption {
  title?: string;
  okLabel?: string;
  cancelLabel?: string;
  buttons: ModalButton[];
}

const DEFAULT_BOTTOM_SHEET_CONFIG = {
  cssClass: 'modal-bottom-sheet',
};

@Injectable({
  providedIn: 'root',
})
export class MobileModalService {
  public dialog = injectBottomSheet();

  public show(message: string, options?: ICustomModalOption) {
    const ref = this.dialog.open(ModalComponent, DEFAULT_BOTTOM_SHEET_CONFIG, {
      title: options?.title || 'common.confirmation',
      message: message,
      buttons: options?.buttons || [
        {
          label: options?.okLabel || 'common.ok',
          role: 'primary',
          action: () => {
            //
          },
        },
        {
          label: options?.cancelLabel || 'common.cancel',
          role: 'destructive',
          action: () => {
            //
          },
        },
      ],
    });

    return ref;
  }

  public success(
    message: string,
    okAction?: () => void,
    options?: ICustomModalOption,
  ) {
    const ref = this.dialog.open(ModalComponent, DEFAULT_BOTTOM_SHEET_CONFIG, {
      title: options?.title || 'common.success',
      message: message,
      buttons: options?.buttons || [
        {
          label: options?.okLabel || 'common.ok',
          role: 'success',
          action: () => {
            okAction?.();
          },
        },
        {
          label: options?.cancelLabel || 'common.back',
          role: 'destructive',
          action: () => {
            //
          },
        },
      ],
    });

    return ref;
  }

  public error(
    message: string,
    okAction?: () => void,
    options?: ICustomModalOption,
  ) {
    const ref = this.dialog.open(ModalComponent, DEFAULT_BOTTOM_SHEET_CONFIG, {
      title: options?.title || 'common.error',
      message: message,
      buttons: options?.buttons || [
        {
          label: options?.okLabel || 'common.ok',
          role: 'error',
          action: () => {
            okAction?.();
          },
        },
        {
          label: options?.cancelLabel || 'common.back',
          role: 'destructive',
          action: () => {
            //
          },
        },
      ],
    });

    return ref;
  }

  public warning(
    message: string,
    okAction?: () => void,
    options?: ICustomModalOption,
  ) {
    const ref = this.dialog.open(ModalComponent, DEFAULT_BOTTOM_SHEET_CONFIG, {
      title: options?.title || 'common.warning',
      message: message,
      buttons: options?.buttons || [
        {
          label: options?.okLabel || 'common.ok',
          role: 'warning',
          action: () => {
            okAction?.();
          },
        },
        {
          label: options?.cancelLabel || 'common.back',
          role: 'destructive',
          action: () => {
            //
          },
        },
      ],
    });

    return ref;
  }

  public asKForAction(
    message: string,
    okAction: () => void,
    rejectAction?: () => void,
    options?: ICustomModalOption,
  ) {
    const ref = this.dialog.open(ModalComponent, DEFAULT_BOTTOM_SHEET_CONFIG, {
      title: options?.title || 'common.confirmation',
      message: message,
      buttons: options?.buttons || [
        {
          label: options?.okLabel || 'common.ok',
          role: 'primary',
          action: () => {
            okAction();
          },
        },
        {
          label: options?.cancelLabel || 'common.cancel',
          role: 'destructive',
          action: () => {
            if (rejectAction) {
              rejectAction();
            }
          },
        },
      ],
    });

    return ref;
  }
}

export const injectModalService = () => {
  return inject(MobileModalService);
};
