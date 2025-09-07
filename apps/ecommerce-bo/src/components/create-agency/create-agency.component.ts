import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { EMixContentStatus } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { agencyDialogEvent } from '../../state';
import { IAgency } from '../../types';

@Component({
  selector: 'mix-create-agency',
  templateUrl: './create-agency.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixDialogWrapperComponent,
    MixButtonComponent,
    MixFormFieldComponent,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
})
export class CreateAgencyComponent extends BaseComponent {
  readonly toast = injectToastService();
  readonly event = injectDispatch(agencyDialogEvent);
  readonly dialogRef = injectDialogRef();
  readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
    isMain: [false],
    status: [EMixContentStatus.Published],
  });

  public onSumbit() {
    if (FormUtils.validateForm(this.form)) {
      const value = this.form.value;
      if (value.isMain) {
        value.status = EMixContentStatus.All;
      }

      this.loadingState.set(LoadingState.Loading);
      this.event.create({
        data: value as IAgency,
        callback: {
          success: () => {
            this.toast.success('User created successfully');
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
