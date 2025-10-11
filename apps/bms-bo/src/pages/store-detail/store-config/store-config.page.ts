import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { IBranch } from '@mixcore/shared-domain';
import { MixDeleteComponent } from '@mixcore/ui/delete';
import { IFormSubmit, MixFormComponent } from '@mixcore/ui/forms';
import {
  IScrollspyMenuItem,
  MixMenuScrollspyComponent,
} from '@mixcore/ui/menu-scrollspy';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';

import { BranchStore, CurrencyStore } from 'apps/bms-bo/src/state';

@Component({
  selector: 'app-store-config-page',
  templateUrl: './store-config.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MixFormComponent, MixDeleteComponent, MixMenuScrollspyComponent],
})
export class StoreConfigPage extends BasePageComponent {
  public store = inject(BranchStore);
  public currencyStore = inject(CurrencyStore);

  public id = injectParams('id');
  public modal = injectModalService();
  public router = injectMiniAppRouter();
  public toast = injectToastService();
  public translateSrv = inject(TranslocoService);

  public data = this.store.selectEntityById(this.id);
  public dataState = this.store.selectEntityStateById(this.id);

  public form = new FormGroup({});
  public fields = computed(() => {
    const currency = this.currencyStore.dataEntities();
    if (!currency.length) return null;

    return [
      {
        key: 'name',
        type: 'input',
        props: {
          label: 'bms.branch.name',
          placeholder: 'common.input.placeholder',
          description: 'bms.branch.nameDescription',
          required: true,
          groupLabel: 'Basic Information',
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
          groupLabel: 'SAP Configuration',
        },
      },
      {
        key: 'taxCode',
        type: 'input',
        props: {
          label: 'Tax code',
          placeholder: 'common.input.placeholder',
          description: 'Store tax code',
        },
      },
      {
        key: 'currencyId',
        type: 'select',
        props: {
          label: 'Currency',
          placeholder: 'common.select.placeholder',
          options: currency.map((c) => ({
            label: `${c.name} - ${c.shortName}`,
            value: c.id,
          })),
          required: true,
        },
      },
      {
        key: 'firstAddressLine',
        type: 'textarea',
        props: {
          label: 'bms.branch.firstAddressLine',
          placeholder: 'common.input.placeholder',
          description: 'bms.branch.firstAddressLineDescription',
          groupLabel: 'Store Contact',
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
      {
        key: 'website',
        type: 'input',
        props: {
          label: 'Website',
          placeholder: 'common.input.placeholder',
        },
      },
      {
        key: 'hotline',
        type: 'input',
        props: {
          label: 'Hot-line',
          placeholder: 'common.input.placeholder',
        },
      },
    ];
  });

  public scrollSpyItems: IScrollspyMenuItem[] = [
    {
      id: 'form-group-basic information',
      label: 'Basic information',
    },
    {
      id: 'form-group-sap configuration',
      label: 'SAP Configuration',
    },
    {
      id: 'form-group-store contact',
      label: 'Store Contact',
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
