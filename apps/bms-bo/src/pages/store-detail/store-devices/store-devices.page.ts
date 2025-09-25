import {
  ChangeDetectionStrategy,
  Component,
  computed,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { ITabItem, MixTabsComponent } from '@mixcore/ui/tabs';

@Component({
  selector: 'app-store-devices-page',
  templateUrl: './store-devices.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, MixTabsComponent],
})
export class StoreDevicesPage extends BasePageComponent {
  public branchId = injectParams('id');

  public tabs = computed(() => {
    const id = this.branchId();
    
    return [
      {
        id: 'table',
        title: 'bms.device.tableView',
        route: ['stores', id, 'devices', 'table'],
        icon: 'table',
      },
      {
        id: 'chart',
        title: 'bms.device.chartView', 
        route: ['stores', id, 'devices', 'chart'],
        icon: 'layout-panel-top',
      },
    ] as ITabItem[];
  });
}
