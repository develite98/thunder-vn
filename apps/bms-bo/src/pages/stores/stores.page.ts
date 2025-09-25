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
import { ESortDirection, MixQuery } from '@mixcore/sdk-client';
import { debouncedSignal, watch } from '@mixcore/signal';
import { injectDialog } from '@mixcore/ui/dialog';
import { ITabItem } from '@mixcore/ui/tabs';
import { CreateStoreFormComponent } from '../../components';
import { BranchStore } from '../../state';

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

  public searchText = signal<string | undefined>(undefined);
  public searchTextDebounced = debouncedSignal(this.searchText, 300);

  constructor() {
    super();

    watch([this.searchTextDebounced], ([keyword]) =>
      this.store.searchRouter(keyword),
    );

    watch([this.queryParams], ([params]) => {
      this.store
        .search(
          new MixQuery()
            .default(10)
            .sort('createdAt', ESortDirection.Desc)
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
    this.router.navigate(['stores', id]);
  }

  public createNew() {
    this.dialog.open(CreateStoreFormComponent);
  }
}
