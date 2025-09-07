import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StringHelper } from '@mixcore/helper';
import { injectModalService } from '@mixcore/ui/modal';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

@Component({
  selector: 'mix-toggle',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NgxControlValueAccessor,
      inputs: ['value'],
      outputs: ['valueChange'],
    },
  ],
})
export class MixToggleComponent {
  protected cva = inject<NgxControlValueAccessor<boolean | undefined>>(
    NgxControlValueAccessor,
  );

  public needConfirm = input(false);
  public description = input<string | null>(null);
  public modal = injectModalService();
  public id = StringHelper.generateUUID();

  onValueChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.checked;

    if (this.needConfirm()) {
      this.modal.asKForAction(
        'common.update.confirmation',
        () => {
          this.cva.value = value;
        },
        () => {
          setTimeout(() => {
            input.checked = this.cva.value ?? false;
          }, 100);
        },
      );
    } else {
      this.cva.value = value;
    }
  }
}
