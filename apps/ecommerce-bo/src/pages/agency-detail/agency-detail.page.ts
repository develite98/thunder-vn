import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { injectParams } from '@mixcore/router';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { injectModalService } from '@mixcore/ui/modal';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { agencyPageEvent, AgencyStore } from '../../state';

@Component({
  selector: 'mix-ecommerce-agency-detail-page',
  templateUrl: './agency-detail.page.html',
  standalone: true,
  imports: [MixPageContainerComponent, MixBreadcrumbsModule, RouterOutlet],
  providers: [],
})
export class EcomAgencyDetailPage {
  readonly id = injectParams('id');
  readonly store = inject(AgencyStore);

  readonly modal = injectModalService();
  readonly event = injectDispatch(agencyPageEvent);
  readonly router = injectMiniAppRouter();
  readonly toast = injectToastService();
  readonly tabs = computed(() => {
    const id = this.id();
    return [
      {
        title: 'ecommerce.tab.mainInfo',
        id: '1',
        route: ['agency', id, 'config'],
        icon: 'list',
      },
      {
        title: 'ecommerce.tab.agencyMember',
        id: '1',
        route: ['agency', id, 'members'],
        icon: 'list',
      },
      {
        title: 'ecommerce.tab.agencyLocation',
        id: '1',
        route: ['agency', id, 'location'],
        icon: 'list',
      },
      {
        title: 'ecommerce.tab.orderProcessingList',
        id: '3',
        route: ['agency', id, 'order-inprogress'],
        icon: 'chart-column',
      },
      {
        title: 'ecommerce.tab.orderSuccessList',
        id: '2',
        route: ['agency', id, 'order-success'],
        icon: 'chart-column',
      },
    ] as ITabItem[];
  });

  readonly user = this.store.selectEntityById(this.id);

  constructor() {
    this.store.getById(this.id() as string).subscribe();
  }
}
