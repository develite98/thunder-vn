import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectAppConfig, ITenant } from '@mixcore/app-config';
import { AppTenantStore } from '@mixcore/base';
import { CulturesSelectComponent } from '@mixcore/ui/culture-select';
import { injectDialog } from '@mixcore/ui/dialog';
import { MixIconComponent } from '@mixcore/ui/icons';
import { ThemeSelectComponent } from '@mixcore/ui/themes-select';
import { MixTileComponent } from '@mixcore/ui/tile';
import { AddNewTenantComponent } from '../add-new-tenant/add-new-tenant.component';

@Component({
  selector: 'app-mix-tenant',
  templateUrl: './tenant.component.html',
  standalone: true,
  imports: [
    CulturesSelectComponent,
    ThemeSelectComponent,
    TranslocoPipe,
    MixTileComponent,
    MixIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixTenantComponent {
  readonly appSetting = injectAppConfig();
  readonly tenantStore = inject(AppTenantStore);
  readonly dialog = injectDialog();

  public addNewTenant() {
    this.dialog.open(AddNewTenantComponent);
  }

  public onChooseTenant(tenant: ITenant) {
    this.tenantStore.setSelectedTenant(tenant);
  }
}
