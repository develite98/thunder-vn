import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { IBmsBranch, IBranch, IBrand } from '@mixcore/shared-domain';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { MixSelectComponent } from '@mixcore/ui/select';
import { injectToastService } from '@mixcore/ui/toast';
import { BmsBranchStore, BranchStore, BrandStore } from '../../state';

@Component({
  selector: 'mix-create-store-form',
  templateUrl: './create-store-form.component.html',
  imports: [
    MixDialogWrapperComponent,
    MixFormFieldComponent,
    MixButtonComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    MixSelectComponent,
  ],
})
export class CreateStoreFormComponent extends BaseComponent {
  public store = inject(BranchStore);
  public brandStore = inject(BrandStore);
  public bmsStore = inject(BmsBranchStore);
  public translateSrv = inject(TranslocoService);
  public toast = injectToastService();
  public dialogRef = injectDialogRef();

  public form = inject(FormBuilder).group({
    name: ['', [Validators.required]],
    shortName: ['', [Validators.required]],
    address: ['', [Validators.required]],
    code: ['', [Validators.required]],
    sapCode: ['', [Validators.required]],
    brandId: [1, [Validators.required]],
  });

  public brands = this.brandStore.dataEntities;
  public labelProcess = (item: IBrand) => item.name;

  public onSubmit() {
    FormUtils.validateForm$(this.form).then(() => {
      this.loadingState.set(LoadingState.Loading);
      const storeData = this.form.value as IBranch;

      this.store
        .createData(storeData, {
          success: (branch: IBranch) => {
            const bmsBranch: IBmsBranch = {
              ...branch,
              originId: branch.id,
            } as unknown as IBmsBranch;

            this.bmsStore.createData(bmsBranch).subscribe();

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
