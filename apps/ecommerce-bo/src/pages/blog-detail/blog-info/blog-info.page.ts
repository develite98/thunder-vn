import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { MixAlertComponent } from '@mixcore/ui/alert';
import { MixDeleteComponent } from '@mixcore/ui/delete';
import { IFormConfig, IFormSubmit, MixFormComponent } from '@mixcore/ui/forms';
import { injectModalService } from '@mixcore/ui/modal';
import { MixSelectComponent } from '@mixcore/ui/select';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { BlogDetailPageEvent } from 'apps/ecommerce-bo/src/state/events/page.event';
import { BlogStore } from 'apps/ecommerce-bo/src/state/store/page.store';
import { EBlogType, IBlog } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-ecom-blog-info',
  templateUrl: './blog-info.page.html',
  imports: [
    MixDeleteComponent,
    MixFormComponent,
    MixAlertComponent,
    MixSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcomBlogDetailInfoPage extends BasePageComponent {
  readonly client = injectMixClient();
  readonly id = injectParams('id');
  readonly store = inject(BlogStore);
  readonly event = injectDispatch(BlogDetailPageEvent);
  readonly modal = injectModalService();
  readonly toast = injectToastService();
  readonly translateSrv = inject(TranslocoService);
  readonly router = injectMiniAppRouter();

  readonly fileUploadFn = (file: File) => {
    return this.client.storage.uploadFile(file, 'blogs').then((res) => {
      if (!res) return res;

      return res.startsWith('https://ecom.')
        ? res.replace('https://ecom.', 'https://')
        : `${res}`;
    });
  };

  readonly base64FileUploadFn = (content: string) => {
    return this.client.storage.uploadFileBase64({
      content,
      fileName: `blogs-thumbnail-${Date.now()}.png`,
      folder: 'blogs',
    });
  };

  public data = this.store.selectEntityById(this.id);
  public dataState = this.store.selectEntityStateById(this.id);

  public form = new FormGroup({});
  public fields: IFormConfig[] = [
    {
      key: 'seo_title',
      type: 'input',
      props: {
        label: 'common.seo.title',
        placeholder: 'common.input.placeholder',
        description: 'common.seo.titleDescription',
      },
    },
    {
      key: 'seo_url',
      type: 'input',
      props: {
        label: 'common.seo.url',
        placeholder: 'common.input.placeholder',
        description: 'common.seo.urlDescription',
      },
    },
    {
      key: 'excerpt',
      type: 'textarea',
      props: {
        label: 'Mô tả ngắn',
        placeholder: 'common.input.placeholder',
        description: 'Mô tả ngắn về bài viết',
      },
    },
    {
      key: 'description',
      type: 'editor',
      props: {
        label: 'Nội dung',
        placeholder: 'common.input.placeholder',
        description: 'Nội dung của bài viết',
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

  public blogTypes = [
    {
      label: 'Bài viết',
      value: EBlogType.POST,
    },
    {
      label: 'Bài viết ghim',
      value: EBlogType.PIN,
    },
    {
      label: 'Bài viết nội bộ',
      value: EBlogType.INTERNAL,
    },
  ];

  public labelProcess = (item: { label: string }) => item.label;

  public onSubmit(event: IFormSubmit<IBlog>) {
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      this.translateSrv.translate('common.update.processing'),
    );

    this.event.updated({
      data: event.value,
      callback: {
        success: () => {
          toastSuccess(this.translateSrv.translate('common.update.success'));
          event.resetControl?.();
        },
        error: () => {
          toastError(this.translateSrv.translate('common.update.error'));
        },
      },
    });
  }

  public onBlogTypeChange(value: EBlogType | undefined) {
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      this.translateSrv.translate('common.update.processing'),
    );

    const data = this.data();
    if (!data || !value) return;

    data.blog_type = value;

    this.event.updated({
      data: data,
      callback: {
        success: () => {
          toastSuccess(this.translateSrv.translate('common.update.success'));
        },
        error: () => {
          toastError(this.translateSrv.translate('common.update.error'));
        },
      },
    });
  }

  public onDelete() {
    this.modal.asKForAction(
      this.translateSrv.translate('common.delete.confirmation'),
      () => {
        const userId = this.id();
        if (!userId) return;

        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translateSrv.translate('common.delete.processing'),
        );

        this.event.deleted({
          data: userId as unknown as number,
          callback: {
            success: () => {
              toastSuccess(
                this.translateSrv.translate('common.delete.success'),
              );

              this.router.navigate(['pages']);
            },
            error: () => {
              toastError(this.translateSrv.translate('common.delete.error'));
            },
          },
        });
      },
    );
  }
}
