import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  injectDialogRef,
  MixWizardDialogWrapperComponent,
} from '@mixcore/ui/dialog';

@Component({
  selector: 'mix-db-table-column-form',
  templateUrl: './table-column-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MixWizardDialogWrapperComponent],
})
export class MixTableColumnFormComponent {
  public dialogRef = injectDialogRef();
}
