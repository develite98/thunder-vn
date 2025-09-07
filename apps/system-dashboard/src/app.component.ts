import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';

@Component({
  selector: 'app-system-dashboard-root',
  template: `
    <ng-template #breadcrumb>
      <mix-breadcrumbs>
        <div [name]="'Home'" icon="home" mixBreadcrumbItem></div>
        <div
          [name]="appNameTranslateKey"
          mixBreadcrumbItem
          [active]="true"
        ></div>
      </mix-breadcrumbs>
    </ng-template>

    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, MixBreadcrumbsModule],
})
export class AppComponent extends BasePageComponent {
  public appNameTranslateKey = `system-dashboard.appName`;
}
