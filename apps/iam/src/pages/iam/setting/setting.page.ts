import { Component } from '@angular/core';
import { MixTableModule } from '@mixcore/ui/table';

@Component({
  selector: 'mix-iam-setting-page',
  templateUrl: './setting.page.html',
  standalone: true,
  imports: [MixTableModule],
  providers: [],
})
export class IamSettingPage {
  constructor() {}
}
