import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { injectParams, onGoBack } from '@mixcore/router';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixWizardDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixIconComponent } from '@mixcore/ui/icons';
import { MixFullScreenPageContainerComponent } from '@mixcore/ui/page-container';
import { MenuItemStore } from 'apps/bms-bo/src/state';

@Component({
  selector: 'bms-menu-item-detail-page',
  templateUrl: './menu-item-detail.page.html',
  imports: [
    MixFullScreenPageContainerComponent,
    MixWizardDialogWrapperComponent,
    MixButtonComponent,
    MixIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemDetailPage {
  readonly id = injectParams('id');
  readonly store = inject(MenuItemStore);
  readonly router = injectMiniAppRouter();

  public data = this.store.selectEntityById(this.id);

  public goBack(): void {
    onGoBack(() => {});
  }
}
