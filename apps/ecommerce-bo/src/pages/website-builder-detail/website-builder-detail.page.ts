import { Component, computed, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { injectParams } from '@mixcore/router';
import { IFormSubmit, MixFormComponent } from '@mixcore/ui/forms';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { injectToastService } from '@mixcore/ui/toast';
import { IWebsiteBuilder, WebsiteBuilderStore } from '../../state';

@Component({
  selector: 'ecom-website-builder-detail-page',
  templateUrl: './website-builder-detail.page.html',
  imports: [MixFormComponent, MixPageContainerComponent],
})
export class EcomWebsiteBuilderDetailPage {
  public id = injectParams('id');
  public store = inject(WebsiteBuilderStore);
  public translateSrv = inject(TranslocoService);
  public toast = injectToastService();

  public data = this.store.selectEntityById(this.id);
  public dataState = this.store.selectEntityStateById(this.id);

  public form = new FormGroup({});
  public fields = computed(() => {
    return this.data()?.form_schema?.formConfig || undefined;
  });

  constructor() {
    const websiteId = this.id();
    if (websiteId) {
      this.store.getById(websiteId).subscribe();
    }
  }

  onSubmit(event: IFormSubmit<any>) {
    let current = this.data()?.value?.data || {};
    current = { ...current, ...event.value };

    let id = this.data()?.id;
    if (!id) return;

    const updatedData = {
      ...this.data(),
      value: {
        data: current,
      },
    } as IWebsiteBuilder;

    const { success: toastSuccess, error: toastError } = this.toast.loading(
      this.translateSrv.translate('common.update.processing'),
    );

    this.store
      .updateData(updatedData, {
        success: () => {
          toastSuccess(this.translateSrv.translate('common.update.success'));
          event.resetControl?.();
        },
        error: () => {
          toastError(this.translateSrv.translate('comoon.update.error'));
        },
      })
      .subscribe();
  }
}
