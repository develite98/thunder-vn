import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '@mixcore/base';

import { RouterOutlet } from '@angular/router';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';

@Component({
  selector: 'app-menus-page',
  templateUrl: './menus.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, MixPageContainerComponent],
})
export class MenusPageComponent extends BasePageComponent {
  readonly tabs: ITabItem[] = [
    {
      id: '1',
      title: 'bms.menu.tab.list',
      icon: 'chart-bar-stacked',
      route: ['menus', 'menu-list'],
    },
    {
      id: '2',
      title: 'bms.menuItems.tab.list',
      icon: 'cherry',
      route: ['menus', 'menu-item-list'],
    },
  ];
}
