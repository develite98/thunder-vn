import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { IBranchArea, IBranchTable } from '@mixcore/shared-domain';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { MixSelectComponent } from '@mixcore/ui/select';
import { injectToastService } from '@mixcore/ui/toast';
import { MixToggleComponent } from '@mixcore/ui/toggle';
import { forkJoin } from 'rxjs';
import { BranchAreaStore, BranchTableStore } from '../../state';

@Component({
  selector: 'mix-create-store-table',
  templateUrl: './create-table-form.component.html',
  imports: [
    MixDialogWrapperComponent,
    MixFormFieldComponent,
    MixButtonComponent,
    MixToggleComponent,
    MixSelectComponent,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
})
export class CreateStoreTableFormComponent extends BaseComponent {
  public store = inject(BranchTableStore);
  public areaStore = inject(BranchAreaStore);

  public translateSrv = inject(TranslocoService);
  public toast = injectToastService();
  public dialogRef = injectDialogRef();

  public updateMode = this.dialogRef.data?.updateMode || false;

  public area = this.dialogRef.data.area as IBranchArea;
  public areaLabelProcess = (area: IBranchArea) => area.name;
  public isBulkCreate = signal(false);

  public form = inject(FormBuilder).group({
    name: ['', [Validators.required]],
    areaId: [this.area?.id, [Validators.required]],
    capacity: [5],
  });

  constructor() {
    super();

    if (this.updateMode) {
      const table = this.dialogRef.data.table as IBranchTable;
      this.form.patchValue({
        name: table.name,
        areaId: table.areaId,
        capacity: table.capacity,
      });
    }
  }

  public onSubmit() {
    FormUtils.validateForm$(this.form).then(() => {
      this.loadingState.set(LoadingState.Loading);

      if (this.isBulkCreate()) {
        const tableNames = this.form.value.name?.split(',') || [];
        const tables = tableNames.map((name) => ({
          ...this.form.value,
          name: name.trim(),
        })) as IBranchTable[];

        const requests = tables.map((table) => this.store.createData(table));
        forkJoin(requests).subscribe({
          next: (r) => {
            this.dialogRef.close(tables);
            this.toast.success(
              this.translateSrv.translate('common.create.success'),
            );
          },
          error: (error) => {
            this.loadingState.set(LoadingState.Pending);
            this.toast.error(
              this.translateSrv.translate('common.create.error', {
                error: error.message,
              }),
            );
          },
        });
      } else {
        const storeData = this.form.value as unknown as IBranchTable;

        this.store
          .createData(storeData, {
            success: (branch: IBranchTable) => {
              this.dialogRef.close(branch);
              this.toast.success(
                this.translateSrv.translate('common.create.success'),
              );
            },
            error: (error) => {
              this.loadingState.set(LoadingState.Pending);
              this.toast.error(
                this.translateSrv.translate('common.create.error', {
                  error: error.message,
                }),
              );
            },
          })
          .subscribe();
      }
    });
  }

  public onSave() {
    FormUtils.validateForm$(this.form).then(() => {
      const value = {
        ...this.dialogRef.data.table,
        ...this.form.value,
      } as IBranchTable;

      this.store
        .updateData(value)
        .pipe(this.observerLoadingState())
        .subscribe({
          next: (area) => {
            this.toast.success(
              this.translateSrv.translate('common.update.success'),
            );
            this.dialogRef.close(area);
          },
        });
    });
  }
}
