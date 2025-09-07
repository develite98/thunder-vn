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
import { productDialogEvent } from '../../state';
import { IProduct } from '../../types';

@Component({
  selector: 'mix-create-product',
  templateUrl: './create-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixDialogWrapperComponent,
    MixButtonComponent,
    MixFormFieldComponent,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
})
export class CreateProductComponent extends BaseComponent {
  readonly toast = injectToastService();
  readonly event = injectDispatch(productDialogEvent);
  readonly dialogRef = injectDialogRef();
  readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    status: [EMixContentStatus.Draft],
  });

  public onSumbit() {
    if (FormUtils.validateForm(this.form)) {
      this.loadingState.set(LoadingState.Loading);
      this.event.create({
        data: this.form.value as IProduct,
        callback: {
          success: () => {
            this.toast.success('Product created successfully');
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
