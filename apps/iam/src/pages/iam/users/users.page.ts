import { Component, inject, signal } from '@angular/core';
import { ESortDirection, MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixTableModule } from '@mixcore/ui/table';

import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { injectQueryParams } from '@mixcore/router';
import { debouncedSignal } from '@mixcore/signal';
import { injectDialog } from '@mixcore/ui/dialog';
import { CreateUserComponent } from 'apps/iam/src/components';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { UserStore } from '../../../state';

@Component({
  selector: 'mix-iam-users-page',
  templateUrl: './users.page.html',
  standalone: true,
  imports: [
    MixTableModule,
    MixButtonComponent,
    MixCopyTextComponent,
    TranslocoPipe,
    DatePipe,
  ],
  providers: [],
})
export class IamUsersPage {
  readonly dialog = injectDialog();
  readonly store = inject(UserStore);
  readonly router = injectMiniAppRouter();
  readonly appRouter = inject(Router);
  readonly queryParams = injectQueryParams();

  public searchText = signal<string | undefined>(undefined);
  public searchTextDebounced = debouncedSignal(this.searchText, 300);

  constructor() {
    explicitEffect([this.searchTextDebounced], ([keyword]) =>
      this.store.searchRouter(keyword),
    );

    explicitEffect([this.queryParams], ([params]) => {
      const query = new MixQuery()
        .default(10)
        .sort('CreatedDateTime', ESortDirection.Desc)
        .withParams(params, {
          paramHandlers: {
            keyword: (value) => MixQuery.Equal('username', value),
          },
        });

      if (params['keyword']) {
        query.searchColumns = 'username';
        query.keyword = params['keyword'];
      }

      this.store.search(query).subscribe();
    });
  }

  onCreateUser() {
    const ref = this.dialog.open(CreateUserComponent, {
      data: {},
      enableClose: {
        backdrop: false,
        escape: true,
      },
    });

    ref.afterClosed$.subscribe((result) => {
      if (result.id) {
        this.router.navigate(['user', result.id]);
      }
    });
  }

  onEditUser(userId: string) {
    this.router.navigate(['user', userId]);
  }
}
