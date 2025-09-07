import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { BrandStore } from './state';

@Component({
  selector: 'app-bms-root',
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
  public appNameTranslateKey = `bms.appName`;

  public brandStore = inject(BrandStore);

  public override ngOnInit(): void {
    super.ngOnInit();

    this.brandStore.search(new MixQuery().default(10)).subscribe();
  }
}
