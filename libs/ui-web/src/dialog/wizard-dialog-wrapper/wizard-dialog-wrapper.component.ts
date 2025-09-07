import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'mix-wizard-dialog-wrapper',
  templateUrl: './wizard-dialog-wrapper.component.html',
  styleUrls: ['./wizard-dialog-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MixWizardDialogWrapperComponent {}
