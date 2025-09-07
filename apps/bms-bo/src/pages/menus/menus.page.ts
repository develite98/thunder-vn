import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { BasePageComponent } from '@mixcore/base';
import { MixButtonComponent } from '@mixcore/ui/buttons';

import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';

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
import { explicitEffect } from 'ngxtension/explicit-effect';
import { CreateStoreFormComponent } from '../../components';
import { IMenu, MenuStore } from '../../state';

@Component({
  selector: 'app-menus-page',
  templateUrl: './menus.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixPageContainerComponent,
    MixButtonComponent,
    MixTableModule,
    TranslocoPipe,
    DatePipe,
  ],
})
export class MenusPageComponent extends BasePageComponent {
  readonly store = inject(MenuStore);

  readonly queryParams = injectQueryParams();
  readonly router = injectMiniAppRouter();
  readonly dialog = injectDialog();

  readonly tabs: ITabItem[] = [
    {
      id: '1',
      title: 'bms.menu.tab.list',
      icon: 'list',
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

  readonly contextMenu: GridContextMenu<IMenu>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.deleteRecord(item),
      iconClass: 'text-error',
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
      this.store
        .search(
          new MixQuery()
            .default(10)
            .sort('lastModified', ESortDirection.Desc)
            .withParams(params, {
              paramHandlers: {
                keyword: (value) => MixQuery.Like('name', value),
              },
            }),
        )
        .subscribe();

      const keyword = params['keyword'];
      if (keyword) this.searchText.set(keyword);
    });
  }

  public goToDetail(id: number) {
    this.router.navigate(['menus', id]);
  }

  public createNew() {
    this.dialog.open(CreateStoreFormComponent);
  }

  public deleteRecord(item: IMenu) {
    //
  }
}
