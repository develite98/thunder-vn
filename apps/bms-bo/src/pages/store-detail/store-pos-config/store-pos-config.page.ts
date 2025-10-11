import { Component, inject } from '@angular/core';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { BmsBranchStore } from 'apps/bms-bo/src/state';
import { explicitEffect } from 'ngxtension/explicit-effect';
import {
  StorePosAddressComponent,
  StorePosNationalitiesComponent,
} from '../../../components';

@Component({
  selector: 'app-store-pos-config-page',
  templateUrl: './store-pos-config.page.html',
  standalone: true,
  imports: [StorePosNationalitiesComponent, StorePosAddressComponent],
})
export class StorePOSConfigPage extends BasePageComponent {
  public id = injectParams('id');
  public bmsStore = inject(BmsBranchStore);

  public bmsBranch = this.bmsStore.selectEntityByField(this.id, 'originId');

  constructor() {
    super();

    explicitEffect([this.id], ([id]) => {
      if (id) this.bmsStore.getById(id).subscribe();
    });
  }
}
