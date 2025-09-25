import { Component, inject, ViewContainerRef } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { injectModalService } from '@mixcore/ui/modal';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { ITabItem } from '@mixcore/ui/tabs';
import { injectToastService } from '@mixcore/ui/toast';
import { DialogService } from '@ngneat/dialog';
import { CreateNetworkComponent } from '../../components';
import { SocialNetworkStore } from '../../state';
import { ISocialNetwork } from '../../types';

@Component({
  selector: 'ecom-social-networks-page',
  templateUrl: './social-networks.page.html',
  standalone: true,
  imports: [
    MixPageContainerComponent,
    MixTableModule,
    MixCopyTextComponent,
    MixButtonComponent,
    TranslocoPipe,
  ],
})
export class EcomSocialNetworksPageComponent extends BasePageComponent {
  public store = inject(SocialNetworkStore);
  public router = injectMiniAppRouter();
  public dialog = inject(DialogService);
  public translateSrv = inject(TranslocoService);
  public modal = injectModalService();
  public toast = injectToastService();
  public vcr = inject(ViewContainerRef);

  public tabs: ITabItem[] = [
    {
      id: '1',
      title: 'Kênh liên lạc',
      icon: 'list',
      route: ['banners', 'list'],
    },
  ];

  readonly contextMenu: GridContextMenu<ISocialNetwork>[] = [
    {
      label: 'common.edit',
      icon: 'square-pen',
      action: (item) => this.onEdit(item),
    },
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.onDelete(item.id),
      iconClass: 'text-error',
    },
  ];

  constructor() {
    super();

    this.store.search(new MixQuery().default(20)).subscribe();
  }

  public onCreate() {
    this.dialog.open(CreateNetworkComponent, { vcr: this.vcr });
  }

  public onEdit(item: ISocialNetwork) {
    this.dialog.open(CreateNetworkComponent, {
      data: {
        data: item,
      },
      vcr: this.vcr,
    });
  }

  public onDelete(id: number) {
    this.modal.asKForAction(
      this.translateSrv.translate('common.delete.confirmation'),
      () => {
        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translateSrv.translate('common.delete.processing'),
        );

        this.store.deleteDataById(id, {
          success: () => {
            toastSuccess(this.translateSrv.translate('common.delete.success'));
          },
          error: (error) => {
            toastError(this.translateSrv.translate('common.delete.error'));
            console.error('Error deleting Agency:', error);
          },
        });
      },
    );
  }
}
