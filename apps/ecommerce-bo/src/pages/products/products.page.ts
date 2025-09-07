import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { BasePageComponent } from '@mixcore/base';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';

@Component({
  selector: 'mix-products',
  templateUrl: './products.page.html',
  imports: [
    MixPageContainerComponent,
    RouterOutlet,
    MixBreadcrumbsModule,
    TranslocoPipe,
  ],
})
export class ProductsPage extends BasePageComponent {
  public tabs: ITabItem[] = [
    {
      id: '1',
      title: 'ecommerce.product.tab.productList',
      route: ['products', 'list'],
      icon: 'list',
    },
    {
      id: '1',
      title: 'ecommerce.product.tab.productCategory',
      route: ['products', 'category'],
      icon: 'tag',
    },
  ];
}
