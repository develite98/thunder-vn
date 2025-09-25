import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { injectAppConfig } from '@mixcore/app-config';
import { AppTenantStore } from '@mixcore/base';
import { injectLocationHistory } from '@mixcore/router';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { DialogService } from '@ngneat/dialog';
import { MixTenantComponent } from './component';

@Component({
  imports: [RouterOutlet, MixTenantComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly locationHistory = injectLocationHistory();
  readonly translocoService = inject(TranslocoService);
  readonly appConfig = injectAppConfig();
  readonly tenantsStore = inject(AppTenantStore);
  readonly client = injectMixClient();
  readonly router = inject(Router);
  readonly dialogService = inject(DialogService);

  public needChooseTenant = computed(() => {
    return (
      this.tenantsStore.canChooseTenant && !this.tenantsStore.selectedTenant()
    );
  });

  constructor() {
    this.translocoService.langChanges$.subscribe((lang) => {
      localStorage.setItem('i18n', lang);
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.dialogService.closeAll();
      }
    });
  }
}
