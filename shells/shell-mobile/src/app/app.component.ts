import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { injectAppConfig } from '@mixcore/app-config';
import { AppTenantStore } from '@mixcore/base';
import { injectLocationHistory } from '@mixcore/router';
import { MixTenantComponent } from './component';

@Component({
  imports: [RouterOutlet, MixTenantComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly locationHistory = injectLocationHistory();
  readonly translocoService = inject(TranslocoService);
  readonly appConfig = injectAppConfig();
  readonly tenantsStore = inject(AppTenantStore);

  public needChooseTenant = computed(() => {
    return (
      this.tenantsStore.canChooseTenant && !this.tenantsStore.selectedTenant()
    );
  });

  constructor() {
    this.translocoService.langChanges$.subscribe((lang) => {
      localStorage.setItem('i18n', lang);
    });
  }
}
