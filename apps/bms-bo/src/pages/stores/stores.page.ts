import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { BasePageComponent } from '@mixcore/base';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';

import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { MixTableModule } from '@mixcore/ui/table';

import { DatePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { injectQueryParams } from '@mixcore/router';
import {
  ECompareOperator,
  ESortDirection,
  MixQuery,
} from '@mixcore/sdk-client';
import { debouncedSignal } from '@mixcore/signal';
import { injectDialog } from '@mixcore/ui/dialog';
import { ITableFilter } from '@mixcore/ui/table';
import { ITabItem } from '@mixcore/ui/tabs';
import { injectDispatch } from '@ngrx/signals/events';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { CreateStoreFormComponent } from '../../components';
import { BranchStore, StoreListPageEvent } from '../../state';

@Component({
  selector: 'app-stores-page',
  templateUrl: './stores.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixPageContainerComponent,
    MixButtonComponent,
    MixCopyTextComponent,
    MixTableModule,
    TranslocoPipe,
    DatePipe,
  ],
})
export class StoresPageComponent extends BasePageComponent {
  readonly queryParams = injectQueryParams();
  readonly router = injectMiniAppRouter();
  readonly store = inject(BranchStore);
  readonly event = injectDispatch(StoreListPageEvent);
  readonly dialog = injectDialog();
  readonly tabs: ITabItem[] = [
    {
      id: '1',
      title: 'bms.branch.tab.list',
      icon: 'list',
    },
    {
      id: '1',
      title: 'bms.branch.tab.map',
      icon: 'map-pin',
    },
  ];

  readonly filters = <ITableFilter[]>[
    {
      fieldName: 'status',
      label: 'Status',
      type: 'text',
      compareOperator: [ECompareOperator.Equal, ECompareOperator.NotEqual],
      options: [
        { key: 'active', label: 'Active', value: true },
        { key: 'inactive', label: 'Inactive', value: false },
      ],
    },
    {
      fieldName: 'code',
      label: 'Store Code',
      compareOperator: [
        ECompareOperator.Equal,
        ECompareOperator.NotEqual,
        ECompareOperator.Contain,
      ],
      type: 'text',
    },
  ];

  public searchText = signal<string | undefined>(undefined);
  public searchTextDebounced = debouncedSignal(this.searchText, 300);

  constructor() {
    super();

    explicitEffect([this.searchTextDebounced], ([keyword]) =>
      this.store.searchRouter(keyword),
    );

    explicitEffect([this.queryParams], ([params]) => {
      this.event.searched(
        new MixQuery()
          .default(10)
          .sort('lastModified', ESortDirection.Desc)
          .withParams(params, {
            paramHandlers: {
              keyword: (value) => MixQuery.Like('name', value),
            },
          }),
      );

      const keyword = params['keyword'];
      if (keyword) this.searchText.set(keyword);
    });
  }

  public goToDetail(id: number) {
    this.router.navigate(['stores', id]);
  }

  public createNew() {
    this.dialog.open(CreateStoreFormComponent);
  }
}
