import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { ObjectUtils } from '@mixcore/helper';
import { injectParams } from '@mixcore/router';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialog } from '@mixcore/ui/dialog';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectModalService } from '@mixcore/ui/modal';
import { MixTileComponent } from '@mixcore/ui/tile';
import { injectToastService } from '@mixcore/ui/toast';
import { MixImageUploadComponent } from '@mixcore/ui/uploader';

import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { injectDispatch } from '@ngrx/signals/events';
import {
  productDetailPageEvent,
  ProductStore,
} from 'apps/ecommerce-bo/src/state';
import { IProduct } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-product-media-page',
  templateUrl: './product-media.page.html',
  imports: [
    MixTileComponent,
    MixIconComponent,
    TranslocoPipe,
    MixButtonComponent,
    DragDropModule,
  ],
})
export class ProductMediaPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly store = inject(ProductStore);
  readonly toast = injectToastService();
  readonly event = injectDispatch(productDetailPageEvent);
  readonly modal = injectModalService();
  readonly router = injectMiniAppRouter();
  readonly client = injectMixClient();
  readonly dialog = injectDialog();

  readonly fileUploadFn = (file: File) => {
    return this.client.storage.uploadFile(file, 'products');
  };

  readonly base64FileUploadFn = (content: string) => {
    return this.client.storage.uploadFileBase64({
      content,
      fileName: `product-${Date.now()}.png`,
      folder: 'products',
    });
  };

  public canSave = false;
  public medias: string[] = [];
  public value: Partial<IProduct> = {};
  public data = this.store.selectEntityById(this.id, (v) => {
    this.value = ObjectUtils.clone(v);
    this.medias = v.media?.mediaList || [];
  });

  public onSubmit(value: IProduct, fromMedia: boolean = false) {
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      'Trying to update product...',
    );

    this.store
      .updateData(
        { ...value, media: { mediaList: this.medias || [] } },
        {
          success: () => {
            if (fromMedia) this.canSave = false;
            toastSuccess('Product updated successfully');
          },
          error: (error) => {
            toastError('Error updating agency');
            console.error('Error updating agency:', error);
          },
        },
      )
      .subscribe();
  }

  public onDelete(image: string) {
    this.modal.asKForAction('Are you sure to remove this data', () => {
      const value = this.value;
      if (!value.media) {
        value.media = { mediaList: [] };
      } else {
        value.media.mediaList = value.media.mediaList.filter(
          (item) => item !== image,
        );
      }

      this.medias = value.media.mediaList;

      this.onSubmit(value as IProduct);
    });
  }

  public addNewImage() {
    const ref = this.dialog.open(MixImageUploadComponent, {
      data: {
        fileUploadFn: this.fileUploadFn,
        base64FileUploadFn: this.base64FileUploadFn,
      },
    });

    ref.afterClosed$.subscribe((result) => {
      if (!result) return;

      const value = this.value;
      if (!value.media) {
        value.media = { mediaList: [] };
      }

      value.media.mediaList.push(result);

      this.medias = value.media.mediaList;

      this.onSubmit(value as IProduct);
    });
  }

  // TODO: REMOVE
  public processImage(image: string) {
    return image.startsWith('https://ecom.')
      ? image.replace('https://ecom.', 'https://')
      : `${image}`;
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.medias, event.previousIndex, event.currentIndex);
    this.canSave = true;
  }
}
