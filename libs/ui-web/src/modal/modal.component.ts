import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { DialogConfig, DialogRef } from '@ngneat/dialog';

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

@Component({
  selector: 'mix-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [TranslocoPipe],
})
export class ModalComponent {
  public static dialogConfig: Partial<DialogConfig> = {
    minWidth: 400,
    maxWidth: 400,
  };

  public dialogRef = inject(DialogRef<ModalConfig>);

  public ok() {
    this.dialogRef.close(true);
  }
}
