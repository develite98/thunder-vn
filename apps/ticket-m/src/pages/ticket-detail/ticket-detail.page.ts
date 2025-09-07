import { Component, effect, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import {
  MixFullPageContainerComponent,
  MixSimpleHeaderComponent,
} from '@mixcore/ui-mobile/layout';
import { TicketStore } from '../../state';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.page.html',
  imports: [
    MixFullPageContainerComponent,
    MixSimpleHeaderComponent,
    TranslocoPipe,
  ],
})
export class TicketDetailPage extends BasePageComponent {
  public id = injectParams('id');
  public store = inject(TicketStore);
  public data = this.store.selectEntityById(this.id);

  constructor() {
    super();

    effect(() => {
      const id = this.id();
      if (id) this.store.getById(id).subscribe();
    });
  }
}
