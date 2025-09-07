import { Component, inject } from '@angular/core';
import { MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';

import { DatePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { injectDialog } from '@mixcore/ui/dialog';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { CreateAgencyComponent } from 'apps/ecommerce-bo/src/components';
import { agencyPageEvent, AgencyStore } from 'apps/ecommerce-bo/src/state';
import { IAgency } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-ecommerce-agency-page',
  templateUrl: './agency.page.html',
  standalone: true,
  imports: [
    MixTableModule,
    MixButtonComponent,
    MixCopyTextComponent,
    TranslocoPipe,
    DatePipe,
  ],
  providers: [],
})
export class EcomAgencyPage {
  readonly dialog = injectDialog();
  readonly modal = injectModalService();
  readonly toast = injectToastService();
  readonly event = injectDispatch(agencyPageEvent);
  readonly store = inject(AgencyStore);
  readonly router = injectMiniAppRouter();

  readonly contextMenu: GridContextMenu<IAgency>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.onDeleteAgency(item.id),
      iconClass: 'text-error',
    },
  ];

  constructor() {
    this.event.opened(
      new MixQuery().default(10).fromQueryParams(window.location.href),
    );
  }

  onCreateUser() {
    this.dialog.open(CreateAgencyComponent, {
      data: {},
    });
  }

  onEditUser(userId: number) {
    this.router.navigate(['agency', userId]);
  }

  onDeleteAgency(userId: number) {
    this.modal.asKForAction('Are you sure to delete this agency', () => {
      const { success: toastSuccess, error: toastError } = this.toast.loading(
        'Trying to delete agency...',
      );

      this.event.deleted({
        data: userId,
        callback: {
          success: () => {
            toastSuccess('Agency deleted successfully');
          },
          error: (error) => {
            toastError('Error deleting Agency');
            console.error('Error deleting Agency:', error);
          },
        },
      });
    });
  }
}
