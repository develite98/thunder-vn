import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { ObjectUtils } from '@mixcore/helper';
import { injectParams } from '@mixcore/router';
import { MixDeleteComponent } from '@mixcore/ui/delete';
import { IFormConfig, IFormSubmit, MixFormComponent } from '@mixcore/ui/forms';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { AgencyStore, agencyPageEvent } from 'apps/ecommerce-bo/src/state';
import { IAgency } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-ecom-agency-config-page',
  templateUrl: './agency-config.page.html',
  imports: [MixFormComponent, MixDeleteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcomAgencyConfigPage {
  readonly id = injectParams('id');
  readonly store = inject(AgencyStore);

  readonly modal = injectModalService();
  readonly event = injectDispatch(agencyPageEvent);
  readonly router = injectMiniAppRouter();
  readonly toast = injectToastService();
  readonly user = this.store.selectEntityById(this.id);

  public value: Partial<IAgency> = {};
  public form = new FormGroup({});
  public fields: IFormConfig[] = [
    {
      key: 'id',
      type: 'input',
      props: {
        label: 'common.label.id',
        placeholder: 'common.input.placeholder',
        description: '',
        required: true,
        disabled: true,
      },
    },
    {
      key: 'title',
      type: 'input',
      props: {
        label: 'common.label.title',
        placeholder: 'common.input.placeholder',
        description: 'ecommerce.input.titleDescription',
        required: true,
      },
      validators: [],
    },
    {
      key: 'email',
      type: 'input',
      props: {
        label: 'common.label.email',
        placeholder: 'common.input.placeholder',
        description: 'ecommerce.input.emailDescription',
        required: true,
      },
      validators: [],
    },
    {
      key: 'phone',
      type: 'input',
      props: {
        label: 'common.label.phoneNumber',
        placeholder: 'common.input.placeholder',
        description: 'ecommerce.input.phoneDescription',
        required: true,
      },
      validators: [],
    },
    {
      key: 'address',
      type: 'textarea',
      props: {
        label: 'Địa chỉ liên hệ',
        placeholder: 'common.input.placeholder',
        description: 'ecommerce.input.addressDescription',
        required: true,
      },
      validators: [],
    },
    {
      key: 'map',
      type: 'textarea',
      props: {
        label: 'Bản đồ nhúng',
        placeholder: 'common.input.placeholder',
      },
    },
  ];

  constructor() {
    effect(() => {
      this.value = ObjectUtils.clone(this.user());
    });
  }

  public onSubmit(event: IFormSubmit<IAgency>) {
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      'Trying to update agency...',
    );

    this.event.updated({
      data: event.value,
      callback: {
        success: () => {
          toastSuccess('Agency updated successfully');
          event.resetControl?.();
        },
        error: (error) => {
          toastError('Error updating agency');
          console.error('Error updating agency:', error);
        },
      },
    });
  }

  public onDelete() {
    this.modal.asKForAction('Are you sure to remove this data', () => {
      const userId = this.id();
      if (!userId) return;

      const { success: toastSuccess, error: toastError } = this.toast.loading(
        'Trying to delete agency...',
      );

      this.event.deleted({
        data: userId as unknown as number,
        callback: {
          success: () => {
            toastSuccess('User deleted successfully');
            this.router.navigate(['users']);
          },
          error: (error) => {
            toastError('Error deleting user');
            console.error('Error deleting user:', error);
          },
        },
      });
    });
  }
}
