import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { IBranchArea } from '@mixcore/shared-domain';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { injectToastService } from '@mixcore/ui/toast';
import { MixToggleComponent } from '@mixcore/ui/toggle';
import { forkJoin } from 'rxjs';
import { BranchAreaStore } from '../../state';

@Component({
  selector: 'mix-create-area-form',
  templateUrl: './create-area-form.component.html',
  imports: [
    MixDialogWrapperComponent,
    MixFormFieldComponent,
    MixButtonComponent,
    MixToggleComponent,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
})
export class CreateStoreAreaFormComponent extends BaseComponent {
  public store = inject(BranchAreaStore);
  public translateSrv = inject(TranslocoService);
  public toast = injectToastService();
  public dialogRef = injectDialogRef();
  public isBulkCreate = signal(false);

  public updateMode = this.dialogRef.data?.updateMode || false;

  public form = inject(FormBuilder).group({
    name: ['', [Validators.required]],
    storeId: [parseInt(this.dialogRef.data.branchId), [Validators.required]],
  });

  constructor() {
    super();

    if (this.updateMode) {
      const area = this.dialogRef.data.area as IBranchArea;
      this.form.patchValue({
        name: area.name,
        storeId: area.storeId,
      });
    }
  }

  public onSubmit() {
    FormUtils.validateForm$(this.form).then(() => {
      this.loadingState.set(LoadingState.Loading);
      if (this.isBulkCreate()) {
        const names = this.form.value.name?.split(',') || [];
        const areas = names.map((name) => ({
          ...this.form.value,
          name: name.trim(),
        })) as IBranchArea[];

        const requests = areas.map((area) => this.store.createData(area));
        forkJoin(requests).subscribe({
          next: () => {
            this.dialogRef.close(areas);
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
        const storeData = this.form.value as IBranchArea;
        this.store
          .createData(storeData, {
            success: (branch: IBranchArea) => {
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
        ...this.dialogRef.data.area,
        ...this.form.value,
      } as IBranchArea;

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
