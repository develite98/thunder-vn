import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixQuery } from '@mixcore/sdk-client';
import { MixIconComponent } from '@mixcore/ui/icons';
import { CurrencyComponent } from 'apps/ecommerce/src/components';
import { OrderHelper } from 'apps/ecommerce/src/types';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { agencyOrderStore } from '../../../stores';
import { AgencyMemberStore } from '../../../stores/agency-member.store';

@Component({
  selector: 'ecom-agency-orders',
  templateUrl: './agency-orders.page.html',
  imports: [
    RouterModule,
    CurrencyComponent,
    MixIconComponent,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
})
export class EcomAgencyOrdersPage {
  public agencyMemberStore = inject(AgencyMemberStore);
  public agencyOrderStore = inject(agencyOrderStore);
  public filterForm = new FormControl('');
  public status = signal<string | null>('');

  constructor() {
    explicitEffect(
      [this.agencyMemberStore.dataEntities, this.status],
      ([members, status]) => {
        if (members && members.length > 0) {
          const member = members[0];
          const agencyId = member.agency_id;
          if (!agencyId) return;

          const query = new MixQuery().default(10).equal('agency_id', agencyId);
          if (status) query.equal('order_status', status);

          this.agencyOrderStore.search(query).subscribe();
        }
      },
    );

    this.filterForm.valueChanges.pipe(takeUntilDestroyed()).subscribe((v) => {
      this.status.set(v);
    });
  }

  public calculateTotal(order: any) {
    return OrderHelper.calculateTotalPrice(order);
  }

  public range = computed(() => {
    const paging = this.agencyOrderStore.pagingInfo();

    return {
      start: paging.pageIndex * paging.pageSize + 1,
      end:
        paging.pageIndex * paging.pageSize +
          this.agencyOrderStore.dataEntities()?.length || 0,
    };
  });
}
