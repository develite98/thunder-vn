import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { injectDispatch } from '@ngrx/signals/events';
import { TicketStatusEvent, TicketStatusStore } from './state';

@Component({
  selector: 'app-ticket-m-root',
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
  public appNameTranslateKey = `ticket-m.appName`;
  public store = inject(TicketStatusStore);
  public event = injectDispatch(TicketStatusEvent);

  constructor() {
    super();

    this.event.pageOpened(
      new MixQuery().default(50).equal('status', 'Published'),
    );
  }
}
