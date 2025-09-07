import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { EMixContentStatus } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { MixSelectComponent } from '@mixcore/ui/select';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { BlogDialogEvent } from '../../state/events/page.event';
import { EBlogType, IBlog } from '../../types';

@Component({
  selector: 'mix-create-blog',
  templateUrl: './create-blog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixDialogWrapperComponent,
    MixButtonComponent,
    MixFormFieldComponent,
    MixSelectComponent,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
})
export class CreateBlogComponent extends BaseComponent {
  readonly event = injectDispatch(BlogDialogEvent);

  readonly translateSrv = inject(TranslocoService);
  readonly toast = injectToastService();
  readonly dialogRef = injectDialogRef();
  readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    seo_title: [''],
    seo_url: ['', [Validators.required]],
    status: [EMixContentStatus.Published],
    blog_type: [EBlogType.POST, Validators.required],
  });

  readonly blogTypes = [
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

  readonly labelProcess = (item: { label: string }) => item.label;

  public onSumbit() {
    if (FormUtils.validateForm(this.form)) {
      const value = this.form.value;

      value.seo_title = value.title;

      this.loadingState.set(LoadingState.Loading);
      this.event.create({
        data: value as IBlog,
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
