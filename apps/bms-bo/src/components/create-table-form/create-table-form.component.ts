import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { IBranchArea, IBranchTable } from '@mixcore/shared-domain';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { injectToastService } from '@mixcore/ui/toast';
import { BranchTableStore } from '../../state';

@Component({
  selector: 'mix-create-store-table',
  templateUrl: './create-table-form.component.html',
  imports: [
    MixDialogWrapperComponent,
    MixFormFieldComponent,
    MixButtonComponent,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
})
export class CreateStoreTableFormComponent extends BaseComponent {
  public store = inject(BranchTableStore);
  public translateSrv = inject(TranslocoService);
  public toast = injectToastService();
  public dialogRef = injectDialogRef();

  public area = this.dialogRef.data.area as IBranchArea;

  public form = inject(FormBuilder).group({
    name: ['', [Validators.required]],
    areaId: [this.area.id, [Validators.required]],
    capacity: [0],
  });

  public onSubmit() {
    FormUtils.validateForm$(this.form).then(() => {
      this.loadingState.set(LoadingState.Loading);
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
    });
  }
}
