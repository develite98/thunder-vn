import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectModalService } from '@mixcore/ui/modal';
import { ITabItem, MixTabsComponent } from '@mixcore/ui/tabs';
import { injectToastService } from '@mixcore/ui/toast';
import { DialogService } from '@ngneat/dialog';
import { TableLayoutEditComponent } from 'apps/bms-bo/src/components';

@Component({
  selector: 'app-store-layout-page',
  templateUrl: './store-layout.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, MixTabsComponent, MixIconComponent],
})
export class StoreLayoutPage extends BasePageComponent {
  public modal = injectModalService();
  public toast = injectToastService();
  public translateSrv = inject(TranslocoService);
  public dialog = inject(DialogService);
  public vcr = inject(ViewContainerRef);

  public branchId = injectParams('id');

  public tabs = computed(() => {
    const id = this.branchId();

    return [
      {
        id: '3',
        title: 'bms.branch.tab.layouts.areas',
        route: ['stores', id, 'layouts', 'areas'],
        icon: 'land-plot',
      },
      {
        id: '4',
        title: 'bms.branch.tab.layouts.tables',
        route: ['stores', id, 'layouts', 'tables'],
        icon: 'table',
      },
    ] as ITabItem[];
  });

  constructor() {
    super();
  }

  public editLayout() {
    this.dialog.open(TableLayoutEditComponent, {
      vcr: this.vcr,
      windowClass: 'fullscreen-dialog',
    });
  }
}
