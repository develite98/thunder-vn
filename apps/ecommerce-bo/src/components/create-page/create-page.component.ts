import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { EMixContentStatus } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { PageDialogEvent } from '../../state/events/page.event';
import { IPage } from '../../types';

@Component({
  selector: 'mix-create-page',
  templateUrl: './create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixDialogWrapperComponent,
    MixButtonComponent,
    MixFormFieldComponent,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
})
export class CreatePageComponent extends BaseComponent {
  readonly event = injectDispatch(PageDialogEvent);

  readonly translateSrv = inject(TranslocoService);
  readonly toast = injectToastService();
  readonly dialogRef = injectDialogRef();
  readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    seo_title: [''],
    seo_url: ['', [Validators.required]],
    status: [EMixContentStatus.Published],
  });

  public onSumbit() {
    if (FormUtils.validateForm(this.form)) {
      const value = this.form.value;

      value.seo_title = value.title;

      this.loadingState.set(LoadingState.Loading);
      this.event.create({
        data: value as IPage,
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
