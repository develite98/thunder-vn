import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { ObjectUtils } from '@mixcore/helper';
import { injectParams } from '@mixcore/router';
import { MixDatabase } from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { IFormConfig, IFormSubmit, MixFormComponent } from '@mixcore/ui/forms';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import {
  ProductStore,
  productDetailPageEvent,
} from 'apps/ecommerce-bo/src/state';
import { IProduct } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-product-seo-page',
  templateUrl: './product-seo.page.html',
  imports: [MixFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSeoPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly store = inject(ProductStore);
  readonly toast = injectToastService();
  readonly event = injectDispatch(productDetailPageEvent);
  readonly modal = injectModalService();
  readonly router = injectMiniAppRouter();
  readonly client = injectMixClient();

  public data = this.store.selectEntityById(this.id, (v) => {
    this.value = ObjectUtils.clone(v);
  });

  public value: Partial<MixDatabase> = {};
  public form = new FormGroup({});
  public fields: IFormConfig[] = [
    {
      key: 'seo_title',
      type: 'input',
      props: {
        label: 'common.seo.title',
        placeholder: 'common.input.placeholder',
        description: 'common.seo.titleDescription',
        required: true,
      },
    },
    {
      key: 'seo_url',
      type: 'input',
      props: {
        label: 'common.seo.url',
        placeholder: 'common.input.placeholder',
        description: 'common.seo.urlDescription',
        required: true,
      },
    },
    {
      key: 'seo_description',
      type: 'textarea',
      props: {
        label: 'common.seo.description',
        placeholder: 'common.input.placeholder',
        description: 'common.seo.descriptionDetail',
        required: true,
      },
    },
  ];

  constructor() {
    super();
  }

  public onSubmit(event: IFormSubmit<IProduct>) {
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      'Trying to update product...',
    );

    this.event.updated({
      data: event.value,
      callback: {
        success: () => {
          toastSuccess('Product updated successfully');
          event.resetControl?.();
        },
        error: (error) => {
          toastError('Error updating agency');
          console.error('Error updating agency:', error);
        },
      },
    });
  }
}
