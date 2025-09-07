import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixTable } from '@mixcore/sdk-client';
import { MixDeleteComponent } from '@mixcore/ui/delete';
import { IFormConfig, IFormSubmit, MixFormComponent } from '@mixcore/ui/forms';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import { DatabaseStore, TableStore } from 'apps/database/src/state';

@Component({
  selector: 'mix-db-table-config-page',
  templateUrl: './table-config.page.html',
  imports: [MixFormComponent, MixDeleteComponent],
})
export class DbTableConfigPage extends BasePageComponent {
  readonly dbId = injectParams('databaseId');
  readonly tableId = injectParams('tableId');
  readonly store = inject(TableStore);
  readonly dbStore = inject(DatabaseStore);
  readonly modal = injectModalService();
  readonly toast = injectToastService();
  readonly router = injectMiniAppRouter();

  readonly table = this.store.selectEntityById(this.tableId);

  public form = new FormGroup({});
  public fields: IFormConfig[] = [
    {
      key: 'displayName',
      type: 'input',
      props: {
        label: 'database.table.label.displayName',
        placeholder: 'common.input.placeholder',
        description: 'database.table.label.displayNameDescription',
        required: true,
      },
    },
    {
      key: 'systemName',
      type: 'input',
      props: {
        label: 'database.table.label.systemName',
        description: 'database.table.label.systemNameDescription',
        placeholder: 'common.input.placeholder',
        required: true,
        readonly: true,
      },
    },
    {
      key: 'description',
      type: 'textarea',
      props: {
        label: 'common.label.description',
        placeholder: 'common.input.placeholder',
      },
    },
  ];

  public onDelete(id: number) {
    this.modal.asKForAction(
      this.translate('common.delete.confirmation'),
      () => {
        const { success, error } = this.toast.loading(
          'common.delete.processing',
        );
        this.store.deleteDataById(id).subscribe({
          next: () => {
            success(this.translate('common.delete.success'));
            this.dbStore.refresh();
            this.router.navigate([this.dbId()!, 'tables']);
          },
          error: (err) => {
            error(err.message || this.translate('common.delete.error'));
          },
        });
      },
    );
  }

  public onSubmit(event: IFormSubmit<MixTable>) {
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      this.translate('common.update.processing'),
    );

    const request = { ...this.table(), ...event.value };

    this.store
      .updateData(request, {
        success: () => {
          toastSuccess(this.translate('common.update.success'));
          event.resetControl?.();
        },
        error: (error) => toastError(this.translate('common.update.error')),
      })
      .subscribe();
  }
}
