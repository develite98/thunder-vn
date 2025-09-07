import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import {
  injectDialog,
  injectDialogRef,
  MixDialogWrapperComponent,
} from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectToastService } from '@mixcore/ui/toast';
import { MixImageUploadComponent } from '@mixcore/ui/uploader';
import { injectDispatch } from '@ngrx/signals/events';
import { HomeBannerListPageEvent } from '../../state';
import { IHomeBanner } from '../../types';

@Component({
  selector: 'mix-create-banner',
  templateUrl: './create-banner.component.html',
  imports: [
    MixDialogWrapperComponent,
    MixButtonComponent,
    MixFormFieldComponent,
    TranslocoPipe,
    ReactiveFormsModule,
    MixIconComponent,
  ],
})
export class CreateBannerComponent extends BaseComponent {
  readonly event = injectDispatch(HomeBannerListPageEvent);
  readonly client = injectMixClient();
  readonly translateSrv = inject(TranslocoService);
  readonly toast = injectToastService();
  readonly dialogRef = injectDialogRef();
  readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    image: [''],
    priority: [0, Validators.required],
    cta_button_url: ['', Validators.required],
  });

  readonly dialog = injectDialog();

  readonly fileUploadFn = (file: File) => {
    return this.client.storage.uploadFile(file, 'homeBanners').then((res) => {
      if (!res) return res;

      return res.startsWith('https://ecom.')
        ? res.replace('https://ecom.', 'https://')
        : `${res}`;
    });
  };

  readonly base64FileUploadFn = (content: string) => {
    return this.client.storage.uploadFileBase64({
      content,
      fileName: `homeBanners-thumbnail-${Date.now()}.png`,
      folder: 'homeBanners',
    });
  };

  public isUpdate = signal(false);

  ngOnInit() {
    const value = this.dialogRef.data?.banner as IHomeBanner | undefined;
    if (value) {
      this.isUpdate.set(true);
      this.form.patchValue(value);
    }
  }

  public onSumbit() {
    if (FormUtils.validateForm(this.form)) {
      if (this.isUpdate()) {
        const value = { ...this.dialogRef.data.banner, ...this.form.value };

        this.loadingState.set(LoadingState.Loading);
        this.event.updated({
          data: value as IHomeBanner,
          callback: {
            success: () => {
              this.toast.success(
                this.translateSrv.translate('common.update.success'),
              );
              setTimeout(() => {
                this.dialogRef.close();
              }, 50);
            },
            error: () => {
              this.loadingState.set(LoadingState.Pending);
            },
          },
        });
      } else {
        const value = this.form.value;

        this.loadingState.set(LoadingState.Loading);
        this.event.create({
          data: value as IHomeBanner,
          callback: {
            success: () => {
              this.toast.success(
                this.translateSrv.translate('common.create.success'),
              );
              setTimeout(() => {
                this.dialogRef.close();
              }, 50);
            },
            error: () => {
              this.loadingState.set(LoadingState.Pending);
            },
          },
        });
      }
    }
  }

  public onUpLoad() {
    const ref = this.dialog.open(MixImageUploadComponent, {
      data: {
        fileUploadFn: this.fileUploadFn,
        base64FileUploadFn: this.base64FileUploadFn,
      },
    });

    ref.afterClosed$.subscribe((result) => {
      if (result) {
        this.form.controls.image.setValue(result);
      }
    });
  }
}
