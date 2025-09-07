import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectAppConfig } from '@mixcore/app-config';
import { MixIdentifyFooterComponent } from '../footer/footer.component';

@Component({
  selector: 'mix-loading',
  imports: [MixIdentifyFooterComponent],
  templateUrl: './loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixLoadingComponent {
  public appSetting = injectAppConfig().appSetting;
}
