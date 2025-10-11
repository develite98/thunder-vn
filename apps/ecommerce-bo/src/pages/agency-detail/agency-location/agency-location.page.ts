import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { StringHelper } from '@mixcore/helper';
import { injectParams } from '@mixcore/router';
import { EMixContentStatus } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialog } from '@mixcore/ui/dialog';
import { injectModalService } from '@mixcore/ui/modal';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { AgencyStore, agencyPageEvent } from 'apps/ecommerce-bo/src/state';
import { IAgencyAddress } from 'apps/ecommerce-bo/src/types';
import { LocationSelectorComponent } from '../location-select/location-select.component';

@Component({
  selector: 'mix-ecom-agency-location-page',
  templateUrl: './agency-location.page.html',
  imports: [MixTableModule, MixButtonComponent, TranslocoPipe, DatePipe],
})
export class EcomAgencyLocationPage {
  readonly id = injectParams('id');
  readonly store = inject(AgencyStore);
  readonly event = injectDispatch(agencyPageEvent);
  readonly dialog = injectDialog();
  readonly modal = injectModalService();
  readonly router = injectMiniAppRouter();
  readonly toast = injectToastService();
  readonly data = this.store.selectEntityById(this.id);

  readonly contextMenu: GridContextMenu<IAgencyAddress>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.onDeleteMember(item.id),
      iconClass: 'text-error',
    },
  ];

  public members = computed(() => this.data()?.addresses?.data || []);

  public onCreateMember() {
    this.dialog
      .open(LocationSelectorComponent, {
        data: {},
      })
      .afterClosed$.subscribe((location: IAgencyAddress) => {
        if (location) {
          this.onSave(location);
        }
      });
  }

  public onSave(location: IAgencyAddress) {
    const data = this.data();
    if (!data) return;

    location.id = StringHelper.generateUUID();
    location.status = EMixContentStatus.Published;
    location.created_date = new Date();
    location.updated_date = new Date();
    delete location.province.wards;

    if (!data.addresses?.data) {
      data.addresses = {
        data: [],
      };
    } else if (
      data.addresses.data.some(
        (item) => item.ward?.name === location.ward?.name,
      )
    ) {
      this.toast.error('This location already exists');
      return;
    }

    data.addresses.data.push(location);

    const { success: toastSuccess, error: toastError } = this.toast.loading(
      'Trying to update agency...',
    );

    this.event.updated({
      data: data,
      callback: {
        success: () => {
          toastSuccess('Agency updated successfully');
        },
        error: (error) => {
          toastError('Error updating agency');
          console.error('Error updating agency:', error);
        },
      },
    });
  }

  public onDeleteMember(id: string) {
    this.modal.asKForAction('Are you sure to remove this data', () => {
      const { success: toastSuccess, error: toastError } = this.toast.loading(
        'Trying to update agency...',
      );

      const data = this.data();
      if (!data) return;

      if (!data.addresses?.data) {
        return;
      }

      data.addresses.data = data.addresses.data.filter(
        (member) => member.id !== id,
      );

      this.event.updated({
        data: data,
        callback: {
          success: () => {
            toastSuccess('Agency updated successfully');
          },
          error: (error) => {
            toastError('Error updating agency');
            console.error('Error updating agency:', error);
          },
        },
      });
    });
  }
}
