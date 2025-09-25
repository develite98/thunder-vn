import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixInlineInputComponent } from '@mixcore/ui/inline-input';
import { injectModalService } from '@mixcore/ui/modal';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { ITabItem } from '@mixcore/ui/tabs';
import { injectToastService } from '@mixcore/ui/toast';
import { DialogService } from '@ngneat/dialog';
import { injectDispatch } from '@ngrx/signals/events';
import { CreateBannerComponent } from '../../components';
import { HomeBannerListPageEvent, HomeBannerStore } from '../../state';
import { IHomeBanner } from '../../types';

@Component({
  selector: 'ecom-home-banner-page',
  templateUrl: './home-banner.page.html',
  standalone: true,
  imports: [
    MixPageContainerComponent,
    MixTableModule,
    MixCopyTextComponent,
    MixButtonComponent,
    MixInlineInputComponent,
    DatePipe,
    TranslocoPipe,
  ],
})
export class EcomHomeBannersPageComponent extends BasePageComponent {
  public store = inject(HomeBannerStore);
  public event = injectDispatch(HomeBannerListPageEvent);
  public router = injectMiniAppRouter();
  public dialog = inject(DialogService);
  public translateSrv = inject(TranslocoService);
  public modal = injectModalService();
  public toast = injectToastService();

  public tabs: ITabItem[] = [
    {
      id: '1',
      title: 'ecommerce.page.pageList',
      icon: 'list',
      route: ['banners', 'list'],
    },
  ];

  readonly contextMenu: GridContextMenu<IHomeBanner>[] = [
    {
      label: 'common.edit',
      icon: 'square-pen',
      action: (item) => this.onEdit(item),
    },
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.onDeleteAgency(item.id),
      iconClass: 'text-error',
    },
  ];

  constructor() {
    super();

    this.event.opened(new MixQuery().default(10));
  }

  public onCreate() {
    this.dialog.open(CreateBannerComponent);
  }

  public onEdit(item: IHomeBanner) {
    this.dialog.open(CreateBannerComponent, {
      data: {
        banner: item,
      },
    });
  }

  public onDeleteAgency(userId: number) {
    this.modal.asKForAction(
      this.translateSrv.translate('common.delete.confirmation'),
      () => {
        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translateSrv.translate('common.delete.processing'),
        );

        this.event.deleted({
          data: userId,
          callback: {
            success: () => {
              toastSuccess(
                this.translateSrv.translate('common.delete.success'),
              );
            },
            error: (error) => {
              toastError(this.translateSrv.translate('common.delete.error'));
              console.error('Error deleting Agency:', error);
            },
          },
        });
      },
    );
  }

  public onUpdatePriority(item: IHomeBanner, priority: number) {
    if (!item || !priority || item.priority === priority) return;

    const { success, error } = this.toast.loading(
      this.translate('common.update.processing'),
    );

    this.store.updateData({ ...item, priority } as IHomeBanner).subscribe({
      next: () => {
        success(this.translate('common.update.success'));
      },
      error: () => {
        error(this.translate('common.update.error'));
      },
    });
  }
}
