import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectToastService } from '@mixcore/ui/toast';

@Component({
  selector: 'mix-copy-text',
  templateUrl: './copy-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClipboardModule, TranslocoPipe, MixIconComponent],
})
export class MixCopyTextComponent {
  public text = input('');
  public copied = signal(false);
  public toast = injectToastService();

  public markCopy() {
    this.copied.set(true);
    this.toast.success('Text copied to clipboard');

    setTimeout(() => {
      this.copied.set(false);
    }, 2000);
  }
}
