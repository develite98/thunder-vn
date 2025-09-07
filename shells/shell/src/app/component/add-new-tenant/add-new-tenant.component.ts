import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { injectToastService } from '@mixcore/ui/toast';

@Component({
  selector: 'app-mix-add-new-tenant',
  templateUrl: './add-new-tenant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MixButtonComponent,
    MixFormFieldComponent,
    MixDialogWrapperComponent,
    TranslocoPipe,
  ],
})
export class AddNewTenantComponent extends BaseComponent {
  readonly toast = injectToastService();
  readonly dialogRef = injectDialogRef();
  readonly form = inject(FormBuilder).nonNullable.group({
    domain: ['', Validators.required],
    name: ['', [Validators.required, Validators.email]],
  });

  public onSumbit() {
    if (FormUtils.validateForm(this.form)) {
      this.loadingState.set(LoadingState.Loading);
      // this.event.create({
      //   data: this.form.value as IRegisterAccountRequest,
      //   callback: {
      //     success: () => {
      //       this.toast.success('User created successfully');
      //       setTimeout(() => {
      //         this.dialogRef.close();
      //       }, 50);
      //     },
      //     error: () => {
      //       this.loadingState.set(LoadingState.Pending);
      //     },
      //   },
      // });
    }
  }
}
