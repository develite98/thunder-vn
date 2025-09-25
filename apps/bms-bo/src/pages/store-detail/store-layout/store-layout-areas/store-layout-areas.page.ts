import { DatePipe } from '@angular/common';
import { Component, inject, ViewContainerRef } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { ESortDirection, MixQuery } from '@mixcore/sdk-client';
import { IBranchArea } from '@mixcore/shared-domain';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { injectDialog } from '@mixcore/ui/dialog';
import { injectModalService } from '@mixcore/ui/modal';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { CreateStoreAreaFormComponent } from '../../../../components/create-area-form/create-area-form.component';
import { BranchAreaStore } from '../../../../state';

@Component({
  selector: 'mix-store-table-layout-area-page',
  templateUrl: './store-layout-areas.page.html',
  imports: [
    MixTableModule,
    DatePipe,
    MixCopyTextComponent,
    MixButtonComponent,
    TranslocoPipe,
  ],
})
export class StoreTableLayoutAreaPageComponent extends BasePageComponent {
  public store = inject(BranchAreaStore);
  public branchStore = inject(BranchAreaStore);
  public dialog = injectDialog();
  public modal = injectModalService();
  public transleSrv = inject(TranslocoService);
  public vcr = inject(ViewContainerRef);
  public toast = injectToastService();

  public branchId = injectParams('id');
  public branch = this.branchStore.selectEntityById(this.branchId);

  public contextMenu: GridContextMenu<IBranchArea>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.deleteArea(item.id),
      iconClass: 'text-error',
    },
  ];

  constructor() {
    super();

    explicitEffect([this.branchId], ([branchId]) => {
      if (branchId)
        this.store
          .search(
            new MixQuery()
              .default(20)
              .sort('createdAt', ESortDirection.Desc)
              .equal('StoreId', branchId.toString()),
          )
          .subscribe();
    });
  }

  public deleteArea(id: number) {
    this.modal.asKForAction(
      this.transleSrv.translate('common.delete.confirmation'),
      () => {
        const { success, error } = this.toast.loading(
          this.transleSrv.translate('common.delete.processing'),
        );
        this.store.deleteDataById(id).subscribe({
          next: () => {
            success(this.transleSrv.translate('common.delete.success'));
          },
          error: (err) => {
            error(this.transleSrv.translate('common.delete.error'));
          },
        });
      },
    );
  }

  public addArea() {
    this.dialog.open(CreateStoreAreaFormComponent, {
      data: { branchId: this.branchId() },
      vcr: this.vcr,
    });
  }

  public editArea(item: IBranchArea) {
    this.dialog.open(CreateStoreAreaFormComponent, {
      data: { branchId: this.branchId(), area: item, updateMode: true },
      vcr: this.vcr,
    });
  }
}
