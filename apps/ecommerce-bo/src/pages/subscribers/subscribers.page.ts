import { Component, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { injectModalService } from '@mixcore/ui/modal';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { MixTableModule } from '@mixcore/ui/table';
import { ITabItem } from '@mixcore/ui/tabs';
import { injectToastService } from '@mixcore/ui/toast';
import { MixToggleComponent } from '@mixcore/ui/toggle';
import { DialogService } from '@ngneat/dialog';
import { CreateBannerComponent } from '../../components';
import { SubscriberStore } from '../../state';
import { ISubscriber } from '../../types';

@Component({
  selector: 'ecom-subscribers-page',
  templateUrl: './subscribers.page.html',
  standalone: true,
  imports: [
    MixPageContainerComponent,
    MixTableModule,
    MixCopyTextComponent,
    MixToggleComponent,
  ],
})
export class EcomSubscribersPageComponent extends BasePageComponent {
  public store = inject(SubscriberStore);
  public router = injectMiniAppRouter();
  public dialog = inject(DialogService);
  public translateSrv = inject(TranslocoService);
  public modal = injectModalService();
  public toast = injectToastService();

  public tabs: ITabItem[] = [
    {
      id: '1',
      title: 'Danh sách đăng ký',
      icon: 'list',
      route: ['subscribers', 'list'],
    },
  ];

  constructor() {
    super();

    this.store.search(new MixQuery().default(10)).subscribe();
  }

  public onCreate() {
    this.dialog.open(CreateBannerComponent);
  }

  public onToggleStatus(item: ISubscriber) {
    const statusToUpdate = item.status === 'processed' ? 'new' : 'processed';
    const updatedItem = { ...item, status: statusToUpdate };

    const { success, error } = this.toast.loading(
      this.translate('common.update.processing'),
    );
    this.store.updateData(updatedItem).subscribe({
      next: () => {
        success(this.translateSrv.translate('common.update.success'));
      },
      error: () => {
        error(this.translateSrv.translate('common.update.error'));
      },
    });
  }
}
