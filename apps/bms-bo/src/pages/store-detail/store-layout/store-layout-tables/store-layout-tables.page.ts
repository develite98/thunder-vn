import { DatePipe } from '@angular/common';
import { Component, inject, signal, ViewContainerRef } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { injectParams } from '@mixcore/router';
import { ESortDirection, MixQuery } from '@mixcore/sdk-client';
import { IBranchTable } from '@mixcore/shared-domain';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { injectDialog } from '@mixcore/ui/dialog';
import { injectModalService } from '@mixcore/ui/modal';
import { MixSelectComponent } from '@mixcore/ui/select';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';
import { CreateStoreTableFormComponent } from 'apps/bms-bo/src/components/create-table-form/create-table-form.component';
import {
  BranchAreaStore,
  BranchStore,
  BranchTableStore,
} from 'apps/bms-bo/src/state';
import { explicitEffect } from 'ngxtension/explicit-effect';

@Component({
  selector: 'mix-store-layout-tables-page',
  templateUrl: './store-layout-tables.page.html',
  imports: [
    MixTableModule,
    MixSelectComponent,
    MixButtonComponent,
    TranslocoPipe,
    MixCopyTextComponent,
    DatePipe,
  ],
})
export class StoreLayoutTablesPageComponent {
  public toast = injectToastService();
  public translateSrv = inject(TranslocoService);
  public areaStore = inject(BranchAreaStore);
  public branchStore = inject(BranchStore);
  public tableStore = inject(BranchTableStore);

  public dialog = injectDialog();
  public modal = injectModalService();
  public transleSrv = inject(TranslocoService);
  public vcr = inject(ViewContainerRef);

  public branchId = injectParams('id');
  public branch = this.branchStore.selectEntityById(this.branchId);
  public selectedBranchAreaId = signal<number | null>(null);

  public labelFn = (area: { id: number; name: string }) => area.name;

  public contextMenu: GridContextMenu<IBranchTable>[] = [
    {
      label: 'Active / Unactive',
      icon: 'trash-2',
      action: (item) => this.deleteTable(item),
      iconClass: 'text-error',
    },
  ];

  constructor() {
    explicitEffect([this.branchId], ([branchId]) => {
      if (branchId)
        this.areaStore
          .search(
            new MixQuery()
              .default(20)
              .sort('createdAt', ESortDirection.Desc)
              .equal('StoreId', branchId.toString()),
          )
          .subscribe();
    });

    explicitEffect([this.selectedBranchAreaId], ([areaId]) => {
      if (areaId)
        this.tableStore
          .search(
            new MixQuery()
              .default(100)
              .sort('createdAt', ESortDirection.Desc)
              .equal('AreaId', areaId.toString()),
          )
          .subscribe();
    });

    explicitEffect(
      [this.areaStore.dataEntities, this.selectedBranchAreaId],
      ([areas, selectedBranchAreaId]) => {
        if (areas.length > 0 && !selectedBranchAreaId)
          this.selectedBranchAreaId.set(areas[0].id);
      },
    );
  }

  public deleteTable(item: IBranchTable) {
    this.modal.asKForAction(
      this.translateSrv.translate('common.delete.confirmation'),
      () => {
        const { success, error } = this.toast.loading(
          this.translateSrv.translate('common.delete.processing'),
        );
        this.tableStore
          .updateData({
            ...item,
            isAvailable: !item.isAvailable,
          })
          .subscribe({
            next: () => {
              success(this.translateSrv.translate('common.delete.success'));
            },
            error: (err) => {
              error(this.translateSrv.translate('common.delete.error'));
            },
          });
      },
    );
  }

  public addTable() {
    const id = this.selectedBranchAreaId();
    if (!id) {
      this.toast.error(this.translateSrv.translate('branch.area.selectFirst'));
      return;
    }

    this.dialog.open(CreateStoreTableFormComponent, {
      data: { area: this.areaStore.dataEntityMap()[id] },
      vcr: this.vcr,
    });
  }

  public updateTable(item: IBranchTable) {
    this.dialog.open(CreateStoreTableFormComponent, {
      data: {
        table: item,
        updateMode: true,
      },
      vcr: this.vcr,
    });
  }
}
