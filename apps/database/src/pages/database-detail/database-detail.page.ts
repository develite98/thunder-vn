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
import { MixTableModule } from '@mixcore/ui/table';
import { ITabItem } from '@mixcore/ui/tabs';
import { injectDispatch } from '@ngrx/signals/events';
import { databasePageEvents } from '../../state';
import { DatabaseStore } from '../../state/stores/database.store';

@Component({
  selector: 'app-database-detail',
  templateUrl: './database-detail.page.html',
  imports: [
    MixPageContainerComponent,
    MixBreadcrumbsModule,
    MixTableModule,
    RouterOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatabaseDetailComponent extends BasePageComponent {
  readonly dbId = injectParams('databaseId');
  readonly tableId = injectParams('tableId');

  readonly dbStore = inject(DatabaseStore);
  readonly dispatch = injectDispatch(databasePageEvents);

  public data = computed(() => {
    const dbMap = this.dbStore.dataEntityMap();
    const dbId = this.dbId();

    if (!dbId || !dbMap[dbId]) return null;

    return dbMap[dbId];
  });

  public tabs = computed(() => {
    return [
      {
        title: 'table.tab.list',
        id: '1',
        route: [this.dbId(), 'tables'],
        icon: 'table',
      },
      {
        title: 'database.tab.config',
        id: '1',
        route: [this.dbId(), 'config'],
        icon: 'chart-column',
      },
    ] as ITabItem[];
  });

  constructor() {
    super();

    if (this.dbStore.isInit()) this.dispatch.opened(new MixQuery().default(25));
  }
}
