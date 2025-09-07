import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BasePageComponent, LoadingState } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { IActionCallback, MixTable } from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { injectModalService } from '@mixcore/ui/modal';
import { MixTileComponent } from '@mixcore/ui/tile';
import { injectToastService } from '@mixcore/ui/toast';
import { TableStore } from '../../../state';

@Component({
  selector: 'db-table-migration',
  templateUrl: './table-migration.page.html',
  imports: [MixTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DbTableMigrationPage extends BasePageComponent {
  readonly tableId = injectParams('tableId');
  readonly store = inject(TableStore);
  readonly table = this.store.selectEntityById(this.tableId);
  readonly tableState = this.store.selectEntityStateById(this.tableId);
  readonly modal = injectModalService();
  readonly toast = injectToastService();

  public client = injectMixClient();

  public onMigrate(type: 'migrate' | 'update' | 'restore' | 'backup') {
    const table = this.table();
    if (!table) return;

    const message =
      type === 'migrate'
        ? 'Are you sure to migrate to single table?'
        : type === 'update'
          ? 'Are you sure to update the table?'
          : type === 'restore'
            ? 'Are you sure to restore the table?'
            : 'Are you sure to backup the table?';

    let request: (
      sysname: number,
      callback?: IActionCallback<MixTable>,
    ) => Promise<MixTable>;
    if (type === 'migrate') {
      request = this.client.table.migrateToTable;
    } else if (type === 'update') {
      request = this.client.table.migrateUpdateTable;
    } else if (type === 'restore') {
      request = this.client.table.migrateRestoreTable;
    } else {
      request = this.client.table.migrateBackupTable;
    }

    this.modal.asKForAction(message, () => {
      this.loadingState.set(LoadingState.Loading);
      const { success: toastSuccess, error: toastError } = this.toast.loading(
        this.translate('common.update.processing'),
      );

      request(table.systemName as unknown as number, {
        success: () => {
          this.loadingState.set(LoadingState.Success);
          toastSuccess(this.translate('common.update.success'));
        },
        error: () => {
          this.loadingState.set(LoadingState.Error);
          toastError(this.translate('common.update.error'));
        },
      });
    });
  }
}
