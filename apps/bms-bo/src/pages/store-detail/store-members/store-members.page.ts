import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { ESortDirection, MixQuery } from '@mixcore/sdk-client';
import { IBranchMemberRelation } from '@mixcore/shared-domain';
import { debouncedSignal } from '@mixcore/signal';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { injectModalService } from '@mixcore/ui/modal';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';
import { DialogService } from '@ngneat/dialog';
import { injectDispatch } from '@ngrx/signals/events';
import { CreateStoreMemberFormComponent } from 'apps/bms-bo/src/components';
import {
  BmsBranchStore,
  BranchMemberStore,
  BranchStore,
  StoreMemberListPageEvent,
} from 'apps/bms-bo/src/state';

@Component({
  selector: 'app-store-members-page',
  templateUrl: './store-members.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixTableModule,
    MixCopyTextComponent,
    MixButtonComponent,
    TranslocoPipe,
    DatePipe,
  ],
})
export class StoreMemberPage extends BasePageComponent {
  public event = injectDispatch(StoreMemberListPageEvent);
  public store = inject(BranchMemberStore);
  public bmsStore = inject(BmsBranchStore);
  public modal = injectModalService();
  public toast = injectToastService();
  public translateSrv = inject(TranslocoService);
  public dialog = inject(DialogService);
  public vcr = inject(ViewContainerRef);

  public branchStore = inject(BranchStore);
  public branchId = injectParams('id');

  public branch = this.branchStore.selectEntityById(this.branchId);
  public branchState = this.branchStore.selectEntityStateById(this.branchId);

  public bmsBranch = this.bmsStore.selectEntityByField(
    this.branchId,
    'originId',
  );

  public searchText = signal<string | undefined>(undefined);
  public searchTextDebounced = debouncedSignal(this.searchText, 300);

  constructor() {
    super();

    effect(() => {
      const branch = this.bmsBranch();

      if (branch) {
        this.event.pageOpened({
          query: new MixQuery()
            .inRange('ParentId', branch.id.toString())
            .sort('id', ESortDirection.Desc),
        });
      }
    });
  }

  readonly contextMenu: GridContextMenu<IBranchMemberRelation>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.onDelete(item.id),
      iconClass: 'text-error',
    },
  ];

  public onDelete(id: number) {
    this.modal.asKForAction('Are you sure to delete this agency', () => {
      const { success: toastSuccess, error: toastError } = this.toast.loading(
        this.translateSrv.translate('common.delete.processing'),
      );

      this.event.memberDeleted({
        data: id,
        callback: {
          success: () => {
            toastSuccess(this.translateSrv.translate('common.delete.success'));
          },
          error: (error) => {
            toastError(this.translateSrv.translate('common.delete.error'));
          },
        },
      });
    });
  }

  public addMember() {
    this.dialog.open(CreateStoreMemberFormComponent, {
      data: { branchId: this.bmsBranch()?.id },
      vcr: this.vcr,
    });
  }
}
