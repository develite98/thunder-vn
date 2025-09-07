import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
} from '@angular/core';

import { MixIconComponent } from '@mixcore/ui/icons';

@Component({
  selector: 'mix-back-button',
  templateUrl: './back-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./back-button.component.scss'],
  imports: [MixIconComponent],
})
export class MixBackButtonComponent {
  public defaultUrl = input('');
  @Input() public onBack: (() => void) | undefined = undefined;

  public goBack() {
    if (this.onBack) {
      this.onBack();
      return;
    }

    if (history.length > 1) {
      history.back();
    } else {
      return;
    }
  }
}
