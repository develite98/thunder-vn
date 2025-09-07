import { Component, computed, inject, signal } from '@angular/core';
import { BasePageComponent } from '@mixcore/base';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';

import type { ITabItem } from '@mixcore/ui/tabs';

import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MiniAppRouter } from '@mixcore/app-config';
import { MixDatabase, MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { injectDialog } from '@mixcore/ui/dialog';
import { MixTableModule } from '@mixcore/ui/table';
import { injectDispatch } from '@ngrx/signals/events';
import { CreateDatabaseDialogComponent } from '../../components';
import { databasePageEvents } from '../../state';
import { DatabaseStore } from '../../state/stores/database.store';

@Component({
  selector: 'app-databases-page',
  imports: [
    MixBreadcrumbsModule,
    MixPageContainerComponent,
    MixTableModule,
    MixCopyTextComponent,
    MixButtonComponent,
    TranslocoPipe,
    DatePipe,
  ],
  templateUrl: './databases.page.html',
})
export class DatabasesPageComponent extends BasePageComponent {
  readonly miniAppRouter = inject(MiniAppRouter);
  readonly router = inject(Router);
  readonly databaseStore = inject(DatabaseStore);
  readonly dispatch = injectDispatch(databasePageEvents);
  readonly dialog = injectDialog();
  readonly translocoService = inject(TranslocoService);

  public searchText = signal<string>('');
  public displayData = computed(() => {
    const data = this.databaseStore.dataEntities();
    const searchText = this.searchText().toLowerCase();

    if (!searchText) {
      return data;
    }

    return data.filter((item: MixDatabase) => {
      return (
        item.displayName.toLowerCase().includes(searchText) ||
        item.systemName?.toLocaleLowerCase().includes(searchText)
      );
    });
  });

  public tabs: ITabItem[] = [
    {
      title: 'database.tab.list',
      id: '1',
      route: ['/app', 'db'],
      icon: 'database',
    },
    {
      title: 'database.tab.usage',
      id: '1',
      route: ['/app', 'db', 'usage'],
      icon: 'chart-column',
    },
  ];

  constructor() {
    super();
    this.dispatch.opened(
      new MixQuery().default(10).fromQueryParams(window.location.href),
    );
  }

  public onCreateDatabase() {
    this.dialog.open(CreateDatabaseDialogComponent, {
      data: {},
    });
  }

  public rowClick(item: MixDatabase) {
    this.miniAppRouter.navigate([item.id]);
  }
}
