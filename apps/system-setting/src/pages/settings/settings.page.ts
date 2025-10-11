import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';

@Component({
  selector: 'app-setting-page',
  templateUrl: './settings.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MixPageContainerComponent, RouterOutlet],
})
export class SettingPageComponent {
  public tabs: ITabItem[] = [
    {
      id: '1',
      title: 'sys.setting.tab.common',
      icon: 'settings',
      route: ['s', 'common'],
    },
    {
      id: '2',
      title: 'sys.setting.tab.oAuth',
      icon: 'key-round',
      route: ['s', 'oauth'],
    },
  ];
}
