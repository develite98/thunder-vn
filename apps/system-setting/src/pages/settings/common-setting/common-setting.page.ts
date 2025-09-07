import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MixAlertComponent } from '@mixcore/ui/alert';

@Component({
  selector: 'app-sys-common-setting-page',
  templateUrl: './common-setting.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MixAlertComponent],
})
export class CommonSettingPage {}
