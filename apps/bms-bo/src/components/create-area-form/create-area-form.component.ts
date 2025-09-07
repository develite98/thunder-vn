import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { IBranchArea } from '@mixcore/shared-domain';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { injectToastService } from '@mixcore/ui/toast';
import { BranchAreaStore } from '../../state';

@Component({
  selector: 'mix-create-area-form',
  templateUrl: './create-area-form.component.html',
  imports: [
    MixDialogWrapperComponent,
    MixFormFieldComponent,
    MixButtonComponent,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
})
export class CreateStoreAreaFormComponent extends BaseComponent {
  public store = inject(BranchAreaStore);
  public translateSrv = inject(TranslocoService);
  public toast = injectToastService();
  public dialogRef = injectDialogRef();

  public form = inject(FormBuilder).group({
    name: ['', [Validators.required]],
    storeId: [parseInt(this.dialogRef.data.branchId), [Validators.required]],
  });

  public onSubmit() {
    FormUtils.validateForm$(this.form).then(() => {
      this.loadingState.set(LoadingState.Loading);
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
    });
  }
}
