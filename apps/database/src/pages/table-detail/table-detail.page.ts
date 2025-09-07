import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixQuery } from '@mixcore/sdk-client';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';
import { injectDispatch } from '@ngrx/signals/events';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { databasePageEvents, DatabaseStore, TableStore } from '../../state';

@Component({
  selector: 'mix-table-detail-page',
  templateUrl: './table-detail.page.html',
  imports: [MixPageContainerComponent, MixBreadcrumbsModule, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDetailPageComponent extends BasePageComponent {
  readonly dbId = injectParams('databaseId');
  readonly tableId = injectParams('tableId');

  readonly dbStore = inject(DatabaseStore);
  readonly tableStore = inject(TableStore);
  readonly dispatch = injectDispatch(databasePageEvents);

  public database = this.dbStore.selectEntityById(this.dbId);
  public table = computed(() => {
    const db = this.database();
    if (!db) return null;

    const tableId = this.tableId();
    if (!tableId) return null;

    return db.databases?.find((t) => t.id === parseInt(tableId));
  });

  public tabs = computed(() => {
    const tableId = this.tableId();
    const dbId = this.dbId();
    return [
      {
        title: 'table.tab.columns',
        id: '1',
        route: [dbId, 'table', 'detail', tableId, 'columns'],
        icon: 'list',
      },
      {
        title: 'table.tab.config',
        id: '2',
        route: [dbId, 'table', 'detail', tableId, 'config'],
        icon: 'settings',
      },
      {
        title: 'database.table.tab.documents',
        id: '2',
        route: [dbId, 'table', 'detail', tableId, 'documents'],
        icon: 'file-stack',
      },
      {
        title: 'database.table.tab.migrations',
        id: '2',
        route: [dbId, 'table', 'detail', tableId, 'migrations'],
        icon: 'history',
      },
    ] as ITabItem[];
  });

  constructor() {
    super();

    if (this.dbStore.isInit()) this.dispatch.opened(new MixQuery().default(25));

    explicitEffect([this.table], ([table]) => {
      if (table) {
        this.tableStore.getById(table.id).subscribe();
      }
    });
  }
}
