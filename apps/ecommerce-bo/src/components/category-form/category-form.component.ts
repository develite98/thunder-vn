import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { injectToastService } from '@mixcore/ui/toast';
import { ProductCategoryStore } from '../../state';
import { IProductCategory } from '../../types';

@Component({
  selector: 'mix-category-form',
  templateUrl: './category-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixDialogWrapperComponent,
    MixButtonComponent,
    MixFormFieldComponent,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
})
export class CategoryFormComponent extends BaseComponent {
  readonly store = inject(ProductCategoryStore);
  readonly toast = injectToastService();
  readonly dialogRef = injectDialogRef();
  readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    priority: [0, [Validators.required, Validators.min(0)]],
  });

  public onSumbit() {
    if (FormUtils.validateForm(this.form)) {
      const value = this.form.value;
      this.loadingState.set(LoadingState.Loading);

      this.store
        .createData(value as IProductCategory, {
          success: () => {
            this.toast.success(this.translate('common.create.success'));
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
