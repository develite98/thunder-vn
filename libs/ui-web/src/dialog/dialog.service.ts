import { inject } from '@angular/core';
import { DialogRef, DialogService } from '@ngneat/dialog';

export const injectDialog = () => {
  return inject(DialogService);
};

export const injectDialogRef = <T>() => {
  return inject(DialogRef<T>);
};
