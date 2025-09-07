import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MixIconComponent } from '@mixcore/ui/icons';

import { injectAppConfig } from '@mixcore/app-config';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { ComingSoomDirective } from '@mixcore/ui/coming-soon';

@Component({
  selector: 'app-portal-outlet',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MixIconComponent,
    ComingSoomDirective,
  ],
  templateUrl: './portal-outlet.html',
  styleUrl: './portal-outlet.css',
  encapsulation: ViewEncapsulation.None,
})
export class PortalOutletComponent {
  public client = injectMixClient();
  public appSetting = injectAppConfig().appSetting;
  public activeTabIndex = 0;
}
