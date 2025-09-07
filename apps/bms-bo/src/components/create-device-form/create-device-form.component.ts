import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';

import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import {
  EMMSBranchDeviceType,
  EMMSBranchDeviceTypeName,
  IMMSBranchDevice,
} from '@mixcore/shared-domain';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixSelectComponent } from '@mixcore/ui/select';
import { injectToastService } from '@mixcore/ui/toast';

import { injectDispatch } from '@ngrx/signals/events';
import { StoreDeviceListPageEvent } from '../../state';

@Component({
  selector: 'mix-create-device-form',
  templateUrl: './create-device-form.component.html',
  imports: [
    MixDialogWrapperComponent,
    MixFormFieldComponent,
    MixButtonComponent,
    MixSelectComponent,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceFormComponent extends BaseComponent {
  public event = injectDispatch(StoreDeviceListPageEvent);
  public toast = injectToastService();
  public dialogRef = injectDialogRef();
  public translateSrv = inject(TranslocoService);

  public typeId = this.dialogRef.data.typeId as EMMSBranchDeviceType;
  public storeId = this.dialogRef.data.storeId;
  public isUpdate = this.dialogRef.data.isUpdate || false;

  public devices = this.dialogRef.data.devices as IMMSBranchDevice[];
  public deviceLabelProcess = (item: IMMSBranchDevice) => item.name;

  public displayName = EMMSBranchDeviceTypeName[this.typeId] || '';

  public customDisplayName = false;
  public form = inject(NonNullableFormBuilder).group({
    name: [''],
    deviceIp: [''],
    typeId: [this.typeId],
    storeId: [this.storeId === 999 ? undefined : this.storeId],
    masterDeviceId: [this.dialogRef.data.masterDeviceId || undefined],
    isDefault: [false],
  });

  public DeviceType = EMMSBranchDeviceType;

  ngOnInit() {
    if (this.dialogRef.data.isUpdate) {
      this.form.patchValue({
        name: this.dialogRef.data.data.name,
        deviceIp: this.dialogRef.data.data.deviceIp,
        typeId: this.dialogRef.data.data.typeId,
        storeId: this.dialogRef.data.data.storeId,
        masterDeviceId: this.dialogRef.data.data.masterDeviceId || undefined,
      });
    }
  }

  public onSubmit() {
    if (!FormUtils.validateForm(this.form)) return;

    this.loadingState.set(LoadingState.Loading);
    if (this.isUpdate) {
      this.event.updated({
        data: { ...this.dialogRef.data.data, ...this.form.value },
        callback: {
          success: () => {
            this.toast.success(this.translateSrv.translate('common.update'));
            this.dialogRef.close();
          },
          error: () => {
            this.loadingState.set(LoadingState.Error);
          },
        },
      });
    } else {
      this.event.created({
        data: this.form.value,
        callback: {
          success: () => {
            this.toast.success('common.create.success');
            this.dialogRef.close();
          },
          error: () => {
            this.loadingState.set(LoadingState.Error);
          },
        },
      });
    }
  }
}
