import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { IFormSubmit } from '@mixcore/ui/forms';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { PageDetailPageEvent } from 'apps/ecommerce-bo/src/state/events/page.event';
import { PageStore } from 'apps/ecommerce-bo/src/state/store/page.store';
import { IPage } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-ecom-page-description',
  templateUrl: './page-description.page.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcomPageDescriptionInfoPage extends BasePageComponent {
  readonly id = injectParams('');
  readonly store = inject(PageStore);
  readonly event = injectDispatch(PageDetailPageEvent);
  readonly modal = injectModalService();
  readonly toast = injectToastService();
  readonly translateSrv = inject(TranslocoService);
  readonly router = injectMiniAppRouter();

  public data = this.store.selectEntityById(this.id);
  public dataState = this.store.selectEntityStateById(this.id);

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
}
