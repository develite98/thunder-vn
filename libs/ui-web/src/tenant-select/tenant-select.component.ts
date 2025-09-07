import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ITenant } from '@mixcore/app-config';

import { AppTenantStore } from '@mixcore/base';
import { TippyDirective } from '@ngneat/helipopper';

@Component({
  selector: 'tenant-select',
  standalone: true,
  imports: [TippyDirective],
  templateUrl: './tenant-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantSelectComponent {
  readonly store = inject(AppTenantStore);

  public onChooseTenant(tenant: ITenant) {
    this.store.setSelectedTenant(tenant);

    setTimeout(() => {
      window.location.href = '/auth/login';
    }, 300);
  }
}
