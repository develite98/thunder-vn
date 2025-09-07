import { DatePipe } from '@angular/common';
import { Component, computed, inject, ViewContainerRef } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BaseComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixTable } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { injectDialog } from '@mixcore/ui/dialog';
import { injectModalService } from '@mixcore/ui/modal';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { CreateTableDialogComponent } from '../../../components';
import { databasePageEvents, TableStore } from '../../../state';
import { DatabaseStore } from '../../../state/stores/database.store';

@Component({
  selector: 'app-db-table-list',
  imports: [
    MixTableModule,
    MixButtonComponent,
    MixCopyTextComponent,
    TranslocoPipe,
    DatePipe,
  ],
  templateUrl: './table-list.component.html',
  styleUrl: './table-list.component.css',
})
export class TableListComponent extends BaseComponent {
  readonly dbId = injectParams('databaseId');
  readonly dbStore = inject(DatabaseStore);
  readonly tableStore = inject(TableStore);

  readonly dispatch = injectDispatch(databasePageEvents);
  readonly miniAppRouter = injectMiniAppRouter();
  readonly dialog = injectDialog();
  readonly vcr = inject(ViewContainerRef);
  readonly modal = injectModalService();
  readonly toast = injectToastService();

  public data = computed(() => {
    const dbMap = this.dbStore.dataEntityMap();
    const dbId = this.dbId();

    if (!dbId || !dbMap[dbId]) return null;

    return dbMap[dbId];
  });

  readonly contextMenu: GridContextMenu<MixTable>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.onDeleteTable(item.id),
      iconClass: 'text-error',
    },
  ];

  public onDeleteTable(item: number) {
    this.modal.asKForAction(
      this.translate('common.delete.confirmation'),
      () => {
        const { success, error } = this.toast.loading(
          'common.delete.processing',
        );
        this.tableStore.deleteDataById(item).subscribe({
          next: () => {
            success(this.translate('common.delete.success'));
            this.dispatch.refreshed(this.dbStore.query());
          },
          error: (err) => {
            error(err.message || this.translate('common.delete.error'));
          },
        });
      },
    );
  }

  public gotoDetail = (tableId: number) => {
    const dbId = this.dbId();
    if (!dbId) return;

    this.miniAppRouter.navigate([dbId, 'table', 'detail', tableId]);
  };

  public onCreateTable = () => {
    const ref = this.dialog.open(CreateTableDialogComponent, {
      data: { contextId: this.dbId() },
      vcr: this.vcr,
    });

    ref.afterClosed$.subscribe((result) => {
      if (result.id) this.gotoDetail(result.id);
    });
  };
}
