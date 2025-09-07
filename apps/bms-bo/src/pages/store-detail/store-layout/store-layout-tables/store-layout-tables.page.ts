import { DatePipe } from '@angular/common';
import {
  Component,
  effect,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { injectParams } from '@mixcore/router';
import { MixQuery } from '@mixcore/sdk-client';
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
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.deleteTable(item.id),
      iconClass: 'text-error',
    },
  ];

  constructor() {
    effect(() => {
      const branchId = this.branchId();
      if (!branchId) return;

      this.areaStore
        .search(
          new MixQuery().default(20).equal('StoreId', branchId.toString()),
        )
        .subscribe();
    });

    effect(() => {
      const areaId = this.selectedBranchAreaId();
      if (!areaId) return;

      this.tableStore
        .search(new MixQuery().default(10).equal('AreaId', areaId.toString()))
        .subscribe();
    });

    effect(() => {
      const areas = this.areaStore.dataEntities();
      if (areas.length > 0 && !this.selectedBranchAreaId()) {
        this.selectedBranchAreaId.set(areas[0].id);
      }
    });
  }

  public deleteTable(id: number) {
    this.modal.asKForAction(
      this.translateSrv.translate('common.delete.confirmation'),
      () => {
        const { success, error } = this.toast.loading(
          this.translateSrv.translate('common.delete.processing'),
        );
        this.tableStore.deleteDataById(id).subscribe({
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
}
