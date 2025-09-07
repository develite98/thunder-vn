import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { injectParams } from '@mixcore/router';
import { MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialog } from '@mixcore/ui/dialog';
import { injectModalService } from '@mixcore/ui/modal';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { CreateAgencyMemberComponent } from 'apps/ecommerce-bo/src/components';
import {
  AgencyMemberStore,
  AgencyStore,
  agencyPageEvent,
} from 'apps/ecommerce-bo/src/state';
import { IAgencyMember } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-ecom-agency-member-page',
  templateUrl: './agency-member.page.html',
  imports: [MixTableModule, MixButtonComponent, TranslocoPipe, DatePipe],
  providers: [AgencyMemberStore],
})
export class EcomAgencyMemberPage {
  readonly id = injectParams('id');
  readonly store = inject(AgencyStore);
  readonly memberStore = inject(AgencyMemberStore);
  readonly event = injectDispatch(agencyPageEvent);
  readonly dialog = injectDialog();
  readonly modal = injectModalService();
  readonly router = injectMiniAppRouter();
  readonly toast = injectToastService();
  readonly data = this.store.selectEntityById(this.id);

  readonly contextMenu: GridContextMenu<IAgencyMember>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.onDeleteMember(item.id as unknown as number),
      iconClass: 'text-error',
    },
  ];

  public members = computed(() => this.data()?.members?.data || []);

  public onCreateMember() {
    this.dialog
      .open(CreateAgencyMemberComponent, {
        data: {},
      })
      .afterClosed$.subscribe((member: IAgencyMember) => {
        if (member) {
          this.onSave(member);
        }
      });
  }

  public onSave(member: IAgencyMember) {
    const { success: toastSuccess, error: toastError } = this.toast.loading(
      'Trying to update agency...',
    );

    const data = this.data();
    if (!data) return;

    member.agency_id = data.id;

    this.memberStore
      .createData(member, {
        success: () => {
          toastSuccess('Agency updated successfully');
        },
        error: (error) => {
          toastError('Error updating agency');
          console.error('Error updating agency:', error);
        },
      })
      .subscribe();
  }

  public onDeleteMember(id: number) {
    this.modal.asKForAction('Are you sure to remove this data', () => {
      const { success: toastSuccess, error: toastError } = this.toast.loading(
        'Trying to update agency...',
      );

      const data = this.data();
      if (!data) return;

      this.memberStore
        .deleteDataById(id, {
          success: () => {
            toastSuccess('Agency updated successfully');
          },
          error: (error) => {
            toastError('Error updating agency');
            console.error('Error updating agency:', error);
          },
        })
        .subscribe();
    });
  }

  constructor() {
    const id = this.id();
    if (!id) return;

    this.memberStore
      .search(new MixQuery().default(10).equal('agency_id', id))
      .subscribe();
  }
}
