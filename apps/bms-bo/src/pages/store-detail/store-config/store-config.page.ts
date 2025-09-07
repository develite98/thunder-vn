import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { IBranch } from '@mixcore/shared-domain';
import { MixDeleteComponent } from '@mixcore/ui/delete';
import { IFormConfig, IFormSubmit, MixFormComponent } from '@mixcore/ui/forms';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';

import { BranchStore } from 'apps/bms-bo/src/state';

@Component({
  selector: 'app-store-config-page',
  templateUrl: './store-config.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MixFormComponent, MixDeleteComponent],
})
export class StoreConfigPage extends BasePageComponent {
  public store = inject(BranchStore);
  public id = injectParams('id');
  public modal = injectModalService();
  public router = injectMiniAppRouter();
  public toast = injectToastService();
  public translateSrv = inject(TranslocoService);

  public data = this.store.selectEntityById(this.id);
  public dataState = this.store.selectEntityStateById(this.id);

  public form = new FormGroup({});
  public fields: IFormConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: 'bms.branch.name',
        placeholder: 'common.input.placeholder',
        description: 'bms.branch.nameDescription',
        required: true,
      },
    },
    {
      key: 'code',
      type: 'input',
      props: {
        label: 'bms.branch.storeCode',
        placeholder: 'common.input.placeholder',
        description: 'bms.branch.storeCodeDescription',
      },
    },
    {
      key: 'sapCode',
      type: 'input',
      props: {
        label: 'bms.branch.label.sapCode',
        placeholder: 'common.input.placeholder',
        description: 'bms.branch.label.sapCodeDescription',
      },
    },
    {
      key: 'firstAddressLine',
      type: 'textarea',
      props: {
        label: 'bms.branch.firstAddressLine',
        placeholder: 'common.input.placeholder',
        description: 'bms.branch.firstAddressLineDescription',
      },
    },
    {
      key: 'secondAddressLine',
      type: 'textarea',
      props: {
        label: 'bms.branch.secondAddressLine',
        placeholder: 'common.input.placeholder',
        description: 'bms.branch.firstAddressLineDescription',
      },
    },
  ];

  public onSubmit(event: IFormSubmit<IBranch>) {
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      'Trying to update store...',
    );

    this.store
      .updateData(event.value, {
        success: () => {
          toastSuccess('Store updated successfully');
          event.resetControl?.();
        },
        error: (error) => {
          toastError('Error updating store');
        },
      })
      .subscribe();
  }

  public onDelete() {
    const id = this.id();
    if (!id) return;

    this.modal.asKForAction(
      this.translateSrv.translate('common.delete.confirmation'),
      () => {
        this.store
          .deleteDataById(id as unknown as number, {
            success: () => {
              this.router.navigate(['stores']);
            },
            error: (error) => {
              this.toast.error(
                this.translateSrv.translate(`common.delete.error`) +
                  ` ${error.message || 'Unknown error'}`,
              );
            },
          })
          .subscribe();
      },
    );
  }
}
