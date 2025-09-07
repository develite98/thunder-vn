import { Component, inject } from '@angular/core';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectDispatch } from '@ngrx/signals/events';
import {
  TicketListPageEvent,
  TicketStatusStore,
  TicketStore,
} from '../../state';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.page.html',
  imports: [MixIconComponent],
})
export class TicketListPage extends BasePageComponent {
  public store = inject(TicketStore);
  public ticketStatusStore = inject(TicketStatusStore);
  public event = injectDispatch(TicketListPageEvent);

  public router = injectMiniAppRouter();

  override ngOnInit() {
    super.ngOnInit();

    this.event.pageOpened(
      new MixQuery().default(50).fromQueryParams(window.location.search),
    );
  }

  public gotoDetail(ticketId: number) {
    if (ticketId) {
      this.router.navigate(['detail', ticketId]);
    }
  }
}
