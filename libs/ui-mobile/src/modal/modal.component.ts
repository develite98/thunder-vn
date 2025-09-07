import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  BOTTOM_SHEET_DATA,
  BOTTOM_SHEET_REF,
} from '@mixcore/ui-mobile/bottom-sheet';

export enum ModalType {
  Confirm,
  Warning,
  Error,
  Success,
  Info,
}

export interface ModalConfig {
  title: string;
  message: string;
  type: ModalType;
}

export interface ModalButton {
  label: string;
  role:
    | 'primary'
    | 'destructive'
    | 'error'
    | 'secondary'
    | 'warning'
    | 'success';
  action: () => void;
}

@Component({
  selector: 'mix-modal-m',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [TranslocoPipe],
})
export class ModalComponent {
  public dialogRef = inject(BOTTOM_SHEET_REF);
  public data = inject(BOTTOM_SHEET_DATA);
  public buttons = (this.data?.buttons || [
    {
      label: 'common.ok',
      role: 'primary',
      action: () => {
        //
      },
    },
    {
      label: 'common.cancel',
      role: 'destructive',
      action: () => {
        this.dialogRef.close(false);
      },
    },
  ]) as ModalButton[];

  public get destructiveButton() {
    return this.buttons.find((b) => b.role === 'destructive');
  }

  public get normalButtons() {
    return this.buttons.filter((b) => b.role !== 'destructive');
  }
}
