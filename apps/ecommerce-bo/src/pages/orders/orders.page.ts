import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';
import { AgencyStore } from '../../state';

@Component({
  selector: 'mix-ecom-orders-page',
  templateUrl: './orders.page.html',
  standalone: true,
  imports: [RouterOutlet, MixBreadcrumbsModule, MixPageContainerComponent],
  providers: [AgencyStore],
})
export class EcomOrdersPage extends BasePageComponent {
  public agencyStore = inject(AgencyStore);

  public tabs: ITabItem[] = [
    {
      title: 'ecommerce.tab.orderProcessingList',
      id: '3',
      route: ['orders', 'progressing'],
      icon: 'chart-column',
    },
    {
      title: 'ecommerce.tab.orderSuccessList',
      id: '2',
      route: ['orders', 'success'],
      icon: 'chart-column',
    },
  ];

  constructor() {
    super();
    this.agencyStore
      .search(new MixQuery().default(100).select('id', 'title'))
      .subscribe();
  }
}
