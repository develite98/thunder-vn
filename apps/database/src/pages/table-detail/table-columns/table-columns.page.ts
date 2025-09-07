import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixColumn } from '@mixcore/sdk-client';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { injectModalService } from '@mixcore/ui/modal';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import {
  CreateColumnButtonComponent,
  TableColumnTypeIconComponent,
} from 'apps/database/src/components';
import { databasePageEvents, TableStore } from '../../../state';

@Component({
  selector: 'mix-table-columns-page',
  templateUrl: './table-columns.page.html',
  imports: [
    MixTableModule,
    MixCopyTextComponent,
    DatePipe,
    CreateColumnButtonComponent,
    TableColumnTypeIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableColumnsPage extends BasePageComponent {
  readonly tableId = injectParams('tableId');
  readonly store = inject(TableStore);
  readonly dispatch = injectDispatch(databasePageEvents);
  readonly table = this.store.selectEntityById(this.tableId);
  readonly tableState = this.store.selectEntityStateById(this.tableId);

  readonly modal = injectModalService();
  readonly toast = injectToastService();

  readonly contextMenu: GridContextMenu<MixColumn>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.onDeleteColumn(item.id),
      iconClass: 'text-error',
    },
  ];

  public onDeleteColumn(id: number) {
    const table = this.table();
    if (!table) return;

    this.modal.asKForAction(
      this.translate('common.delete.confirmation'),
      () => {
        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translate('common.delete.processing'),
        );

        table.columns = table.columns.filter((c) => c.id !== id);

        this.store
          .deleteColumn(table.id, id, {
            success: () => {
              toastSuccess(this.translate('common.update.success'));
            },
            error: (error) => {
              toastError(
                `Error creating table: ${error?.message || 'Unknown error'}`,
              );
            },
          })
          .subscribe();
      },
    );
  }
}
