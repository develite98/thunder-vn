import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';

@Component({
  selector: 'mix-ecommerce-page',
  templateUrl: './ecommerce.page.html',
  standalone: true,
  imports: [RouterOutlet, MixBreadcrumbsModule, MixPageContainerComponent],
  providers: [],
})
export class EcommerceRootPage extends BasePageComponent {
  public tabs: ITabItem[] = [
    {
      title: 'ecommerce.tab.agencyList',
      id: '1',
      route: ['users'],
      icon: 'list',
    },
    // {
    //   title: 'ecommerce.tab.security',
    //   id: '2',
    //   route: ['security'],
    //   icon: 'chart-column',
    // },
    // {
    //   title: 'ecommerce.tab.settings',
    //   id: '3',
    //   route: ['settings'],
    //   icon: 'chart-column',
    // },
  ];
}
