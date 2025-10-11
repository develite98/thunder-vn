import { Component, inject, ViewContainerRef } from '@angular/core';
import {
  ECompareOperator,
  ESortDirection,
  MixQuery,
} from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { ITableFilter, MixTableModule } from '@mixcore/ui/table';

import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectQueryParams } from '@mixcore/router';
import { watch } from '@mixcore/signal';
import { injectDialog } from '@mixcore/ui/dialog';
import {
  BulkCreateUserComponent,
  CreateUserComponent,
} from 'apps/iam/src/components';
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
export class IamUsersPage extends BasePageComponent {
  readonly dialog = injectDialog();
  readonly store = inject(UserStore);
  readonly router = injectMiniAppRouter();
  readonly appRouter = inject(Router);
  readonly queryParams = injectQueryParams();
  readonly vcr = inject(ViewContainerRef);

  public filterConfig: ITableFilter[] = [
    {
      fieldName: 'userName',
      label: 'Username',
      type: 'text',
      allowdOperators: [ECompareOperator.Equal],
    },
  ];

  constructor() {
    super();

    watch([this.queryParams], ([params]) => {
      const query = new MixQuery()
        .default(15)
        .sort('CreatedDateTime', ESortDirection.Desc)
        .withParams(params);

      const username = query.queries?.find((x) => x.fieldName === 'userName');
      if (username) {
        query.searchColumns = 'username';
        query.keyword = username.value as string;
      }

      this.store.search(query).subscribe();
    });
  }

  public onCreateUser() {
    const ref = this.dialog.open(CreateUserComponent, {
      data: {},
      vcr: this.vcr,
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

  public onCreateBulkUser() {
    this.dialog.open(BulkCreateUserComponent, {
      vcr: this.vcr,
      windowClass: 'fullscreen-dialog',
    });
  }

  public onEditUser(userId: string) {
    this.router.navigate(['user', userId]);
  }
}
