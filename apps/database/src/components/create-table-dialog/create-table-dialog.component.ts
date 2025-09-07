import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils, StringHelper } from '@mixcore/helper';
import { MixTable } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { injectToastService } from '@mixcore/ui/toast';
import { DatabaseStore, TableStore } from '../../state';

@Component({
  selector: 'mix-database-create-table-dialog',
  templateUrl: './create-table-dialog.component.html',
  imports: [
    MixFormFieldComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    MixDialogWrapperComponent,
    MixButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTableDialogComponent extends BaseComponent {
  public dbStore = inject(DatabaseStore);
  public tableStore = inject(TableStore);
  public dialogRef = injectDialogRef();
  public toast = injectToastService();

  public form = inject(FormBuilder).group({
    displayName: ['', [Validators.required]],
    systemName: ['', [Validators.required]],
    description: ['', []],
    mixDatabaseContextId: [this.dialogRef.data.contextId, []],
    namingConvention: ['SnakeCase', []],
    type: ['Service', []],
    columns: [[]],
    deletePermissions: [[]],
    readPermissions: [[]],
    updatePermissions: [[]],
    createPermissions: [[]],
  });

  constructor() {
    super();

    this.form.controls.displayName.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        if (value) {
          this.form.controls.systemName.setValue(
            StringHelper.toSnakeCase(value),
            { emitEvent: false },
          );
        }
      });
  }

  public onSubmit() {
    FormUtils.validateForm$(this.form).then(() => {
      this.loadingState.set(LoadingState.Loading);

      this.tableStore
        .createData(this.form.value as unknown as MixTable, {
          success: (item) => {
            this.toast.success(this.translate('common.create.success'));
            this.dbStore.search(this.dbStore.query()).subscribe();

            setTimeout(() => {
              this.dialogRef.close(item);
            }, 50);
          },
          error: (error) => {
            this.loadingState.set(LoadingState.Pending);
            this.toast.error(
              `Error creating table: ${error?.message || 'Unknown error'}`,
            );
          },
        })
        .subscribe();
    });
  }
}
