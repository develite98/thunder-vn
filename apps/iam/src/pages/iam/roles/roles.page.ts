import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixTableModule } from '@mixcore/ui/table';
import { injectDispatch } from '@ngrx/signals/events';
import { roleListPageEvent, RoleStore } from 'apps/iam/src/state';

@Component({
  selector: 'mix-iam-roles-page',
  templateUrl: './roles.page.html',
  standalone: true,
  imports: [
    MixTableModule,
    MixButtonComponent,
    MixCopyTextComponent,
    TranslocoPipe,
  ],
  providers: [],
})
export class IamRolesPage extends BasePageComponent {
  readonly event = injectDispatch(roleListPageEvent);
  readonly store = inject(RoleStore);
  readonly router = injectMiniAppRouter();

  constructor() {
    super();

    this.event.opened(
      new MixQuery().default(10).fromQueryParams(window.location.href),
    );
  }
}
