import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { MixTableModule } from '@mixcore/ui/table';
import { ITabItem } from '@mixcore/ui/tabs';
import { DialogService } from '@ngneat/dialog';
import { injectDispatch } from '@ngrx/signals/events';
import { CreatePageComponent } from '../../components';
import { PageListPageEvent } from '../../state/events/page.event';
import { PageStore } from '../../state/store/page.store';

@Component({
  selector: 'ecom-pages-page',
  templateUrl: './pages.page.html',
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
export class EcomPagesPageComponent extends BasePageComponent {
  public store = inject(PageStore);
  public event = injectDispatch(PageListPageEvent);
  public router = injectMiniAppRouter();
  public dialog = inject(DialogService);

  public tabs: ITabItem[] = [
    {
      id: '1',
      title: 'ecommerce.page.pageList',
      icon: 'list',
      route: ['pages', 'list'],
    },
  ];

  constructor() {
    super();

    this.event.opened(
      new MixQuery().default(5).fromQueryParams(window.location.search),
    );
  }

  public goDetail(id: number) {
    this.router.navigate(['pages', id]);
  }

  public onCreate() {
    this.dialog.open(CreatePageComponent);
  }
}
