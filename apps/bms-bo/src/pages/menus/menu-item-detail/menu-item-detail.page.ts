import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { injectParams, onGoBack } from '@mixcore/router';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';
import { MenuItemStore } from 'apps/bms-bo/src/state';
import { explicitEffect } from 'ngxtension/explicit-effect';

@Component({
  selector: 'bms-menu-item-detail-page',
  templateUrl: './menu-item-detail.page.html',
  imports: [MixPageContainerComponent, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemDetailPage {
  readonly id = injectParams('id');
  readonly store = inject(MenuItemStore);
  readonly router = injectMiniAppRouter();

  public data = this.store.selectEntityById(this.id);
  public dateState = this.store.selectEntityStateById(this.id);

  public tabs = computed(() => {
    const id = this.id();

    return [
      {
        id: '1',
        title: 'bms.menuItem.tab.configuration',
        route: ['menus', 'menu-item', id, 'configuration'],
        icon: 'settings',
      },
      {
        id: '1',
        title: 'bms.menuItem.tab.images',
        route: ['menus', 'menu-item', id, 'configuration'],
        icon: 'settings',
      },
      {
        id: '1',
        title: 'bms.menuItem.tab.comments',
        route: ['menus', 'menu-item', id, 'comments'],
        icon: 'message-circle',
      },
      {
        id: '1',
        title: 'bms.menuItem.tab.i18n',
        route: ['menus', 'menu-item', id, 'configuration'],
        icon: 'settings',
      },
    ] as ITabItem[];
  });

  public goBack(): void {
    onGoBack(() => {});
  }

  constructor() {
    explicitEffect([this.id], ([id]) => {
      if (id) this.store.getById(id).subscribe();
    });
  }
}
