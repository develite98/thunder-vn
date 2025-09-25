import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { injectModalService } from '@mixcore/ui/modal';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';
import { injectToastService } from '@mixcore/ui/toast';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { RoleStore, UserStore } from '../../state';

@Component({
  selector: 'mix-iam-user-detail-page',
  templateUrl: './user-detail.page.html',
  standalone: true,
  imports: [MixPageContainerComponent, MixBreadcrumbsModule, RouterOutlet],
  providers: [RoleStore],
})
export class IamUserDetailPage extends BasePageComponent {
  readonly modal = injectModalService();
  readonly useId = injectParams('userId');
  readonly store = inject(UserStore);
  readonly router = injectMiniAppRouter();
  readonly toast = injectToastService();

  readonly tabs = computed(() => {
    const userId = this.useId();
    return [
      {
        title: 'iam.tab.mainInfo',
        id: '1',
        route: ['user', userId, 'config'],
        icon: 'list',
      },
      {
        title: 'iam.tab.permissions',
        id: '1',
        route: ['user', userId, 'role'],
        icon: 'lock-open',
      },
    ] as ITabItem[];
  });

  public user = this.store.selectEntityById(this.useId);
  public dataState = this.store.selectEntityStateById(this.useId);

  constructor() {
    super();

    explicitEffect([this.useId], ([userId]) => {
      if (!userId) return;

      this.store.getById(userId).subscribe();
    });
  }
}
