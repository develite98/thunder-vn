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
import { SocialNetworkStore } from '../../state';
import { ISocialNetwork } from '../../types';

@Component({
  selector: 'mix-create-network',
  templateUrl: './create-network.component.html',
  imports: [
    MixDialogWrapperComponent,
    MixButtonComponent,
    MixFormFieldComponent,
    TranslocoPipe,
    ReactiveFormsModule,
    MixIconComponent,
  ],
})
export class CreateNetworkComponent extends BaseComponent {
  readonly store = inject(SocialNetworkStore);
  readonly client = injectMixClient();
  readonly translateSrv = inject(TranslocoService);
  readonly toast = injectToastService();
  readonly dialogRef = injectDialogRef();
  readonly form = inject(FormBuilder).nonNullable.group({
    display_name: ['', Validators.required],
    icon: [''],
    priority: [0, Validators.required],
    link: ['', Validators.required],
  });

  readonly dialog = injectDialog();

  readonly fileUploadFn = (file: File) => {
    return this.client.storage
      .uploadFile(file, 'social-networks')
      .then((res) => {
        if (!res) return res;

        return res.startsWith('https://ecom.')
          ? res.replace('https://ecom.', 'https://')
          : `${res}`;
      });
  };

  readonly base64FileUploadFn = (content: string) => {
    return this.client.storage.uploadFileBase64({
      content,
      fileName: `social-networks-thumbnail-${Date.now()}.png`,
      folder: 'social-networks',
    });
  };

  public isUpdate = signal(false);

  ngOnInit() {
    const value = this.dialogRef.data?.data as ISocialNetwork | undefined;
    if (value) {
      this.isUpdate.set(true);
      this.form.patchValue(value);
    }
  }

  public onSumbit() {
    if (FormUtils.validateForm(this.form)) {
      if (this.isUpdate()) {
        const value = { ...this.dialogRef.data.data, ...this.form.value };

        this.loadingState.set(LoadingState.Loading);
        this.store
          .updateData(value as ISocialNetwork, {
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
          })
          .subscribe();
      } else {
        const value = this.form.value;

        this.loadingState.set(LoadingState.Loading);
        this.store
          .createData(value as ISocialNetwork, {
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
          })
          .subscribe();
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
        this.form.controls.icon.setValue(result);
      }
    });
  }
}
