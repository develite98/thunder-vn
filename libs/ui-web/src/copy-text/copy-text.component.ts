import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
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
export class MixCopyTextComponent implements OnDestroy {
  public text = input('');
  public copied = signal(false);
  public toast = injectToastService();
  
  private timeoutId: number | null = null;

  public markCopy() {
    this.copied.set(true);
    this.toast.success('Text copied to clipboard');

    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.copied.set(false);
      this.timeoutId = null;
    }, 2000);
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
