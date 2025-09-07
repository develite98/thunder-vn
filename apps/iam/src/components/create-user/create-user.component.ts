import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { IRegisterAccountRequest } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { userDialogEvent } from '../../state';

@Component({
  selector: 'mix-create-user',
  templateUrl: './create-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixDialogWrapperComponent,
    MixButtonComponent,
    MixFormFieldComponent,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
})
export class CreateUserComponent extends BaseComponent {
  readonly toast = injectToastService();
  readonly event = injectDispatch(userDialogEvent);
  readonly dialogRef = injectDialogRef();

  readonly form = inject(FormBuilder).nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  public onSumbit() {
    if (FormUtils.validateForm(this.form)) {
      this.loadingState.set(LoadingState.Loading);
      this.event.create({
        data: this.form.value as IRegisterAccountRequest,
        callback: {
          success: (item) => {
            this.toast.success('User created successfully');
            setTimeout(() => {
              this.dialogRef.close(item);
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
