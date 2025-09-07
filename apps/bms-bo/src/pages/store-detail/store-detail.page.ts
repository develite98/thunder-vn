import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';
import { injectDispatch } from '@ngrx/signals/events';
import {
  BmsBranchStore,
  BranchAreaStore,
  BranchMemberStore,
  BranchStore,
  BranchTableStore,
  StoreDetailPageEvent,
} from '../../state';

@Component({
  selector: 'app-store-detail-page',
  templateUrl: './store-detail.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MixPageContainerComponent, RouterOutlet],
  providers: [
    BmsBranchStore,
    BranchMemberStore,
    BranchAreaStore,
    BranchTableStore,
  ],
})
export class StoreDetailPageComponent extends BasePageComponent {
  public store = inject(BranchStore);
  public bmsBranchStore = inject(BmsBranchStore);

  public event = injectDispatch(StoreDetailPageEvent);
  public id = injectParams('id');

  public tabs = computed(() => {
    const id = this.id();
    return [
      {
        id: '1',
        title: 'bms.branch.tab.config',
        route: ['stores', id, 'config'],
        icon: 'settings',
      },
      {
        id: '3',
        title: 'bms.branch.tab.layouts',
        route: ['stores', id, 'layouts', 'areas'],
        icon: 'house-plug',
      },
      {
        id: '3',
        title: 'bms.branch.tab.members',
        route: ['stores', id, 'members'],
        icon: 'users',
      },

      {
        id: '3',
        title: 'bms.branch.tab.device',
        route: ['stores', id, 'devices'],
        icon: 'monitor-smartphone',
      },
    ] as ITabItem[];
  });

  public data = this.store.selectEntityById(this.id);
  public dataState = this.store.selectEntityStateById(this.id);

  constructor() {
    super();

    effect(() => {
      const id = this.id();
      if (id) {
        this.event.pageOpened({ data: parseInt(id) });
      }
    });

    effect(() => {
      const data = this.data();
      if (data && this.bmsBranchStore.isInit())
        this.bmsBranchStore.getById(data.id).subscribe();
    });
  }
}
