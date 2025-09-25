import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { ObjectUtils } from '@mixcore/helper';
import { injectParams } from '@mixcore/router';
import { injectMixClient } from '@mixcore/sdk-client-ng';

import { MixDeleteComponent } from '@mixcore/ui/delete';
import { IFormConfig, IFormSubmit, MixFormComponent } from '@mixcore/ui/forms';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import {
  ProductCategoryStore,
  productCategoryPageEvent,
} from 'apps/ecommerce-bo/src/state';
import { IProductCategory } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-product-category-config-page',
  templateUrl: './config.page.html',
  imports: [MixFormComponent, MixDeleteComponent],
})
export class ProductCategoryConfigPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly store = inject(ProductCategoryStore);
  readonly toast = injectToastService();
  readonly event = injectDispatch(productCategoryPageEvent);
  readonly modal = injectModalService();
  readonly router = injectMiniAppRouter();
  readonly client = injectMixClient();

  readonly fileUploadFn = (file: File) => {
    return this.client.storage.uploadFile(file, 'products').then((res) => {
      if (!res) return res;

      return res.startsWith('https://ecom.')
        ? res.replace('https://ecom.', 'https://')
        : `${res}`;
    });
  };

  readonly base64FileUploadFn = (content: string) => {
    return this.client.storage.uploadFileBase64({
      content,
      fileName: `product-detail-${Date.now()}.png`,
      folder: 'products',
    });
  };

  public value: Partial<IProductCategory> = {};
  public data = this.store.selectEntityById(this.id, (v) => {
    this.value = ObjectUtils.clone(v);
  });

  public form = new FormGroup({});
  public fields: IFormConfig[] = [
    {
      key: 'title',
      type: 'input',
      props: {
        label: 'ecommerce.productCategory.name',
        placeholder: 'common.input.placeholder',
        description: 'ecommerce.productCategory.nameDescription',
        required: true,
      },
    },
    {
      key: 'description',
      type: 'textarea',
      props: {
        label: 'ecommerce.productCategory.description',
        description: 'ecommerce.productCategory.descriptionDetail',
        placeholder: 'common.input.placeholder',
        required: true,
      },
    },
    {
      key: 'long_description',
      type: 'editor',
      props: {
        label: 'ecommerce.product.description',
        description: 'ecommerce.product.descriptionDetail',
        placeholder: 'common.input.placeholder',
        required: true,
        fileUploadFn: this.fileUploadFn,
        base64FileUploadFn: this.base64FileUploadFn,
      },
    },
  ];

  public onSubmit(event: IFormSubmit<IProductCategory>) {
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      'Trying to update category...',
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

  public onDelete() {
    this.modal.asKForAction('Are you sure to remove this data', () => {
      const userId = this.id();
      if (!userId) return;

      const { success: toastSuccess, error: toastError } = this.toast.loading(
        'Trying to delete Product...',
      );

      this.event.deleted({
        data: userId as unknown as number,
        callback: {
          success: () => {
            toastSuccess('Product deleted successfully');
            this.router.navigate(['users']);
          },
          error: (error) => {
            toastError('Error deleting product');
            console.error('Error deleting product:', error);
          },
        },
      });
    });
  }
}
