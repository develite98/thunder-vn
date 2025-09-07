import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';

@Component({
  selector: 'mix-iam-page',
  templateUrl: './iam.page.html',
  standalone: true,
  imports: [RouterOutlet, MixBreadcrumbsModule, MixPageContainerComponent],
  providers: [],
})
export class IamRootPage extends BasePageComponent {
  public tabs: ITabItem[] = [
    {
      title: 'iam.tab.userList',
      id: '1',
      route: ['users'],
      icon: 'list',
    },
    {
      title: 'iam.tab.roles',
      id: '2',
      route: ['roles'],
      icon: 'shield-check',
    },
  ];
}
