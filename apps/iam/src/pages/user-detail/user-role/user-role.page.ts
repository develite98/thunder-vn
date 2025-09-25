import { Component, computed, inject } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixQuery } from '@mixcore/sdk-client';
import { MixTileComponent } from '@mixcore/ui/tile';
import { injectToastObserve } from '@mixcore/ui/toast';
import { MixToggleComponent } from '@mixcore/ui/toggle';
import { RoleStore, UserStore } from 'apps/iam/src/state';

@Component({
  selector: 'mix-iam-user-role-page',
  templateUrl: './user-role.page.html',
  providers: [],
  imports: [MixTileComponent, MixToggleComponent, TranslocoPipe],
})
export class IamUserRolePageComponent extends BasePageComponent {
  readonly roleStore = inject(RoleStore);

  readonly useId = injectParams('userId');
  readonly store = inject(UserStore);
  readonly router = injectMiniAppRouter();
  readonly translateSrv = inject(TranslocoService);

  readonly toastObserver = injectToastObserve();

  public user = this.store.selectEntityById(this.useId);
  public userRoleDict = computed(() => {
    const user = this.user();
    if (!user) return {};

    return user.roles.reduce(
      (acc, role) => {
        acc[role.roleId] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  });

  constructor() {
    super();

    if (this.roleStore.isInit())
      this.roleStore.search(new MixQuery().default(100)).subscribe();
  }

  public onUserRoleChange(
    roleId: string,
    roleName: string,
    isChecked: boolean,
  ) {
    const user = this.user();
    if (!user) return;

    this.store
      .changeUserRole(user.id, roleId, roleName, isChecked)
      .pipe(
        this.toastObserver({
          success: this.translateSrv.translate('common.update.success'),
          loading: this.translateSrv.translate('common.update.processing'),
          error: this.translateSrv.translate('common.update.error'),
        }),
      )
      .subscribe();
  }
}
