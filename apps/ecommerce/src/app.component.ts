import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { publicAgencyStore } from './stores';

@Component({
  selector: 'app-ecom-root',
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, MixBreadcrumbsModule],
})
export class AppComponent extends BasePageComponent {
  public agencyStore = inject(publicAgencyStore);

  constructor() {
    super();

    setTimeout(() => {
      this.agencyStore.search(new MixQuery().default(50)).subscribe();
    }, 2000);
  }
}
