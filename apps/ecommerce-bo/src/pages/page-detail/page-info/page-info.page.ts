import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixDeleteComponent } from '@mixcore/ui/delete';
import { IFormConfig, IFormSubmit, MixFormComponent } from '@mixcore/ui/forms';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { PageDetailPageEvent } from 'apps/ecommerce-bo/src/state/events/page.event';
import { PageStore } from 'apps/ecommerce-bo/src/state/store/page.store';
import { IPage } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-ecom-page-info',
  templateUrl: './page-info.page.html',
  imports: [MixDeleteComponent, MixFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcomPageDetailInfoPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly store = inject(PageStore);
  readonly event = injectDispatch(PageDetailPageEvent);
  readonly modal = injectModalService();
  readonly toast = injectToastService();
  readonly translateSrv = inject(TranslocoService);
  readonly router = injectMiniAppRouter();

  public data = this.store.selectEntityById(this.id);
  public dataState = this.store.selectEntityStateById(this.id);

  public form = new FormGroup({});
  public fields: IFormConfig[] = [
    {
      key: 'seo_title',
      type: 'input',
      props: {
        label: 'common.seo.title',
        placeholder: 'common.input.placeholder',
        description: 'common.seo.titleDescription',
      },
    },
    {
      key: 'seo_url',
      type: 'input',
      props: {
        label: 'common.seo.url',
        placeholder: 'common.input.placeholder',
        description: 'common.seo.urlDescription',
      },
    },
    {
      key: 'seo_description',
      type: 'textarea',
      props: {
        label: 'common.seo.description',
        placeholder: 'common.input.placeholder',
        description: 'common.seo.descriptionDetail',
      },
    },
    {
      key: 'description',
      type: 'editor',
      props: {
        label: 'common.label.description',
        placeholder: 'common.label.placeholder',
        description: 'common.label.descriptionDetail',
      },
    },
  ];

  public onSubmit(event: IFormSubmit<IPage>) {
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      this.translateSrv.translate('common.update.processing'),
    );

    this.event.updated({
      data: event.value,
      callback: {
        success: () => {
          toastSuccess(this.translateSrv.translate('common.update.success'));
          event.resetControl?.();
        },
        error: () => {
          toastError(this.translateSrv.translate('common.update.error'));
        },
      },
    });
  }

  public onDelete() {
    this.modal.asKForAction(
      this.translateSrv.translate('common.delete.confirmation'),
      () => {
        const userId = this.id();
        if (!userId) return;

        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translateSrv.translate('common.delete.processing'),
        );

        this.event.deleted({
          data: userId as unknown as number,
          callback: {
            success: () => {
              toastSuccess(
                this.translateSrv.translate('common.delete.success'),
              );

              this.router.navigate(['pages']);
            },
            error: () => {
              toastError(this.translateSrv.translate('common.delete.error'));
            },
          },
        });
      },
    );
  }
}
