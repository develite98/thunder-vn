import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
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
import { injectDispatch } from '@ngrx/signals/events';
import { CreateBlogComponent } from '../../components/create-blog/create-blog.component';
import { BlogListPageEvent } from '../../state/events/page.event';
import { BlogStore } from '../../state/store/page.store';
import { IBlog } from '../../types';

@Component({
  selector: 'ecom-blogs-page',
  templateUrl: './blogs.page.html',
  standalone: true,
  imports: [
    MixPageContainerComponent,
    MixTableModule,
    MixCopyTextComponent,
    MixButtonComponent,
    DatePipe,
    TranslocoPipe,
  ],
})
export class EcomBlocksPageComponent extends BasePageComponent {
  public store = inject(BlogStore);
  public event = injectDispatch(BlogListPageEvent);
  public router = injectMiniAppRouter();
  public dialog = inject(DialogService);
  public modal = injectModalService();
  public toast = injectToastService();

  public tabs: ITabItem[] = [
    {
      id: '1',
      title: 'ecommerce.blog.pageList',
      icon: 'list',
      route: ['blogs'],
    },
  ];

  public contextMenu: GridContextMenu<IBlog>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.onDelete(item.id),
      iconClass: 'text-error',
    },
  ];

  constructor() {
    super();

    this.event.opened(
      new MixQuery().default(5).fromQueryParams(window.location.search),
    );
  }

  public goDetail(id: number) {
    this.router.navigate(['blogs', id]);
  }

  public onCreate() {
    this.dialog.open(CreateBlogComponent);
  }

  public onDelete(id: number) {
    this.modal.asKForAction(
      this.translate('common.delete.confirmation'),
      () => {
        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translate('common.delete.processing'),
        );

        this.store
          .deleteDataById(id, {
            success: () => {
              toastSuccess(this.translate('common.delete.success'));
            },
            error: (error) => {
              toastError(this.translate('common.delete.error'));
              console.error('Error deleting Agency:', error);
            },
          })
          .subscribe();
      },
    );
  }
}
