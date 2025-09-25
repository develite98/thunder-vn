import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { watch } from '@mixcore/signal';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';
import {
  BmsBranchStore,
  BranchAreaStore,
  BranchMemberStore,
  BranchStore,
  BranchTableStore,
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
  public id = injectParams('id');

  public store = inject(BranchStore);
  public bmsBranchStore = inject(BmsBranchStore);

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
        id: '2',
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
        id: '4',
        title: 'bms.branch.tab.device',
        route: ['stores', id, 'devices', 'table'],
        icon: 'monitor-smartphone',
      },
    ] as ITabItem[];
  });

  public data = this.store.selectEntityById(this.id);
  public dataState = this.store.selectEntityStateById(this.id);

  constructor() {
    super();

    watch([this.id], ([id]) => {
      if (id) this.store.getById(parseInt(id)).subscribe();
    });

    watch([this.data, this.bmsBranchStore.isInit], ([data, isInit]) => {
      if (data && isInit) this.bmsBranchStore.getById(data.id).subscribe();
    });
  }
}
