import { Component, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AiChatPannelComponent } from '@mixcore/modules/ai-world';
import {
  MixIdentifyFooterComponent,
  MixLoadingComponent,
} from '@mixcore/modules/identify';
import { UserProfileDropdownComponent } from '@mixcore/modules/profile';

import type { TGroupMenuItem } from '@mixcore/types';
import {
  BreadcrumbsOutletComponent,
  BreadcrumbsService,
} from '@mixcore/ui/breadcrumbs';
import { CulturesSelectComponent } from '@mixcore/ui/culture-select';
import { MixIconComponent } from '@mixcore/ui/icons';

import { injectTenant } from '@mixcore/base';
import { IfRoleDirective } from '@mixcore/permissions';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { ComingSoomDirective } from '@mixcore/ui/coming-soon';
import { TenantSelectComponent } from '@mixcore/ui/tenant';
import { ThemeSelectComponent } from '@mixcore/ui/themes-select';
import { appSetting } from '../../../../environments/environment';

@Component({
  selector: 'app-portal-outlet',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslocoPipe,
    CulturesSelectComponent,
    ThemeSelectComponent,
    TenantSelectComponent,
    MixIconComponent,
    MixIdentifyFooterComponent,
    MixLoadingComponent,
    BreadcrumbsOutletComponent,
    AiChatPannelComponent,
    UserProfileDropdownComponent,
    IfRoleDirective,
    ComingSoomDirective,
  ],
  templateUrl: './portal-outlet.html',
  styleUrl: './portal-outlet.css',
})
export class PortalOutletComponent {
  public client = injectMixClient();
  public tenant = injectTenant();

  public breadcrumbService = inject(BreadcrumbsService);
  public activeRoute = inject(ActivatedRoute);
  public router = inject(Router);
  public appSetting = appSetting.appSetting;

  public showLevel1Menu = true;
  public activeLevel2Menu = signal<TGroupMenuItem | null>(null);

  public menu: TGroupMenuItem[] =
    this.tenant.selectedTenant()?.sideBarMenu ||
    this.appSetting?.sideBarMenu ||
    [];

  public subMenu: TGroupMenuItem[] =
    this.tenant.selectedTenant()?.subSidebarMenu ||
    this.appSetting?.subSidebarMenu ||
    [];

  public showLoading = signal(true);
  public showNavigationProgress = signal(false);

  constructor() {
    this.router.events.pipe().subscribe((e) => {
      if (e instanceof NavigationStart) {
        this.showNavigationProgress.set(true);
      } else if (e instanceof NavigationEnd) {
        this.showNavigationProgress.set(false);

        const subMenu = this.subMenu.find((x) =>
          this.matchLocation(x.pathMatch, e.url),
        );

        if (subMenu) {
          this.showLevel1Menu = false;
          this.activeLevel2Menu.set(subMenu);
        } else {
          this.showLevel1Menu = true;
          this.activeLevel2Menu.set(null);
        }
      } else if (
        e instanceof NavigationCancel ||
        e instanceof NavigationError
      ) {
        this.showNavigationProgress.set(false);
      }
    });

    this.client.auth.initUserData({
      success: () => {
        setTimeout(() => {
          this.showLoading.set(false);
        }, 1000);
      },
      error: () => {
        this.showLoading.set(false);
      },
    });
  }

  public matchLocation(
    input: string | RegExp | undefined,
    path: string,
  ): boolean {
    if (!input) return false;

    const exp = new RegExp(input);

    return exp.test(path);
  }
}
