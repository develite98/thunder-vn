import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { MixDeleteComponent } from '@mixcore/ui/delete';
import { IFormConfig, IFormSubmit, MixFormComponent } from '@mixcore/ui/forms';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import {
  productDetailPageEvent,
  ProductStore,
} from 'apps/ecommerce-bo/src/state';
import { IProduct } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-product-config-page',
  templateUrl: './product-config.page.html',
  imports: [MixFormComponent, MixDeleteComponent],
})
export class ProductConfigPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly store = inject(ProductStore);
  readonly translateSrv = inject(TranslocoService);
  readonly toast = injectToastService();
  readonly event = injectDispatch(productDetailPageEvent);
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
      fileName: `product-thumbnail-${Date.now()}.png`,
      folder: 'products',
    });
  };

  public dataState = this.store.selectEntityStateById(this.id);
  public data = this.store.selectEntityById(this.id);

  public form = new FormGroup({});
  public fields: IFormConfig[] = [
    {
      key: 'title',
      type: 'input',
      props: {
        label: 'ecommerce.product.name',
        placeholder: 'common.input.placeholder',
        description: 'ecommerce.product.nameDescription',
        required: true,
      },
    },
    {
      key: 'short_description',
      type: 'textarea',
      props: {
        label: 'ecommerce.product.shortDescription',
        placeholder: 'common.input.placeholder',
        description: 'ecommerce.product.shortDescriptionDetail',
        required: true,
      },
    },
    {
      key: 'price',
      type: 'input',
      props: {
        label: 'ecommerce.product.price',
        placeholder: 'common.input.placeholder',
        description: 'ecommerce.product.priceDescription',
        required: true,
        type: 'number',
        recommends: [
          { label: '100k', value: 100000 },
          { label: '200k', value: 200000 },
          { label: '300k', value: 300000 },
        ],
      },
    },
    {
      key: 'price_list',
      type: 'key-value',
      props: {
        label: 'ecommerce.product.priceList',
        placeholder: 'common.input.placeholder',
        description: 'ecommerce.product.priceListDescription',
        keyPlaceholder: 'ecommerce.product.attributeKeyPlaceHolder',
        valuePlaceholder: 'ecommerce.product.attributeValuePlaceHolder',
      },
    },
    {
      key: 'attributes',
      type: 'key-value',
      props: {
        label: 'ecommerce.product.attributes',
        description: 'ecommerce.product.attributesDescription',
        keyPlaceholder: 'ecommerce.product.attributeKeyPlaceHolder',
        valuePlaceholder: 'ecommerce.product.attributeValuePlaceHolder',
        required: true,
      },
    },
    {
      key: 'description',
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
    {
      key: 'thumbnail',
      type: 'image',
      props: {
        label: 'ecommerce.product.thumbnail',
        placeholder: 'common.input.placeholder',
        description: 'ecommerce.product.thumbnailDescription',
        required: true,
        fileUploadFn: this.fileUploadFn,
        base64FileUploadFn: this.base64FileUploadFn,
      },
    },
  ];

  public onSubmit(event: IFormSubmit<IProduct>) {
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      this.translateSrv.translate('Trying to update product...'),
    );

    this.event.updated({
      data: event.value,
      callback: {
        success: () => {
          toastSuccess(
            this.translateSrv.translate('Product updated successfully'),
          );
          event.resetControl?.();
        },
        error: () => {
          toastError(this.translateSrv.translate('Error updating agency'));
        },
      },
    });
  }

  public onDelete() {
    this.modal.asKForAction(
      this.translateSrv.translate('Are you sure to remove this data'),
      () => {
        const userId = this.id();
        if (!userId) return;

        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translateSrv.translate('Trying to delete Product...'),
        );

        this.event.deleted({
          data: userId as unknown as number,
          callback: {
            success: () => {
              toastSuccess(
                this.translateSrv.translate('Product deleted successfully'),
              );

              this.router.navigate(['users']);
            },
            error: () => {
              toastError(this.translateSrv.translate('Error deleting product'));
            },
          },
        });
      },
    );
  }
}
