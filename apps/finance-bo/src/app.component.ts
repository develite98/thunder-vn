import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { BranchStore } from './state/stores/branch.store';

@Component({
  selector: 'app-finance-root',
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
  public appNameTranslateKey = `finance.appName`;
  public branchStore = inject(BranchStore);

  constructor() {
    super();

    this.branchStore.search(new MixQuery()).subscribe();
  }
}
