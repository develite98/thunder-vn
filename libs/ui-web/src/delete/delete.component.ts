import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixTileComponent } from '@mixcore/ui/tile';

@Component({
  selector: 'mix-delete',
  templateUrl: './delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoPipe,
    MixTileComponent,
    MixButtonComponent,
    ReactiveFormsModule,
  ],
})
export class MixDeleteComponent {
  public title = input<string>('common.label.delete');
  public description = input<string>('common.label.deleteConfirmation');
  public buttonLabel = input<string>('common.label.delete');
  public confirmRequireText = input<string>('CONFIRM');

  public onDelete = output();
  public canDelete = signal(false);
  public form = new FormControl('');

  constructor() {
    this.form.valueChanges.subscribe((value) => {
      this.canDelete.set(value === this.confirmRequireText());
    });
  }
}
