import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { EDataType, MixColumn, MixTable } from '@mixcore/sdk-client';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { MixIconComponent } from '@mixcore/ui/icons';
import { DATA_TYPE_DISPLAY } from '../../types';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils, StringHelper } from '@mixcore/helper';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectToastService } from '@mixcore/ui/toast';
import { MixToggleComponent } from '@mixcore/ui/toggle';
import { DatabaseStore, TableStore } from '../../state';

export function snakeCaseValidator(): ValidatorFn {
  const snakeCaseRegex = /^[a-z][a-z0-9_]*$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && !snakeCaseRegex.test(value)) {
      return { snake_case: true };
    }
    return null;
  };
}

@Component({
  selector: 'mix-create-column-form',
  templateUrl: './create-column-form.component.html',
  imports: [
    MixDialogWrapperComponent,
    MixFormFieldComponent,
    TranslocoPipe,
    ReactiveFormsModule,
    MixIconComponent,
    MixButtonComponent,
    MixToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateColumnFormComponent extends BaseComponent {
  public tableStore = inject(TableStore);
  public dbStore = inject(DatabaseStore);

  public dialogRef = injectDialogRef();
  public toast = injectToastService();

  public dataType = this.dialogRef.data.type as EDataType;
  public table = this.dialogRef.data.table as MixTable;
  public dataTypeDisplay = DATA_TYPE_DISPLAY[this.dataType];

  public form = inject(NonNullableFormBuilder).group({
    systemName: ['', [Validators.required, snakeCaseValidator()]],
    displayName: [''],
    description: [''],
    dataType: [this.dataType],
    defaultValue: [''],
  });

  public configurationForms = inject(NonNullableFormBuilder).group({
    isUnique: [false],
    isRequire: [false],
    isEncrypt: [false],
  });

  public showAlterColumnWarning = signal(false);
  public column = signal<MixColumn | null>(null);

  constructor() {
    super();
    this.form.controls.displayName.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.form.controls.systemName.setValue(
          StringHelper.toSnakeCase(value),
          {
            emitEvent: false,
          },
        );
      });
  }

  public onSubmit() {
    FormUtils.validateForm$(this.form).then(() => {
      this.loadingState.set(LoadingState.Loading);

      const column = this.form.value as unknown as MixColumn;

      column.mixDatabaseName = this.table.systemName;
      column.priority = (this.table.columns?.length || 0) + 1;
      column.columnConfigurations = this.configurationForms
        .value as unknown as any;

      this.table.columns = [...(this.table.columns || []), column];
      this.tableStore
        .updateData(this.table as unknown as MixTable, {
          success: (item) => {
            const newColumn =
              item.columns?.find((c) => c.systemName === column.systemName) ||
              null;

            (newColumn as any).isDrop = true;
            (newColumn as any).isDelete = false;

            this.column.set(newColumn);
            this.toast.success(this.translate('common.update.success'));
            this.loadingState.set(LoadingState.Pending);
            this.showAlterColumnWarning.set(true);
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

  public onReflectChange() {
    const column = this.column();
    if (!column) return;

    this.loadingState.set(LoadingState.Loading);
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      this.translate('Reflecting change to database...'),
    );

    this.tableStore
      .alterColumn(column, {
        success: (item) => {
          toastSuccess(this.translate('common.update.success'));
          setTimeout(() => {
            this.dialogRef.close();
          }, 500);
        },
        error: (error) => {
          this.loadingState.set(LoadingState.Pending);
          toastError(
            `Error creating table: ${error?.message || 'Unknown error'}`,
          );
        },
      })
      .subscribe();
  }
}
