import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectAppConfig } from '@mixcore/app-config';

@Component({
  selector: 'mix-identify-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe],
})
export class MixIdentifyFooterComponent {
  public appSetting = injectAppConfig().appSetting;
}
