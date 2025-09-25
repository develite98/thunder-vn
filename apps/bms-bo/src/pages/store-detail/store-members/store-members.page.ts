import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BasePageComponent, LoadingState } from '@mixcore/base';
import { injectParams, injectQueryParams } from '@mixcore/router';
import { ESortDirection, MixQuery } from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { IBranchMember } from '@mixcore/shared-domain';
import { debouncedSignal } from '@mixcore/signal';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { injectModalService } from '@mixcore/ui/modal';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';
import { DialogService } from '@ngneat/dialog';
import {
  BulkCreateStoreMemberComponent,
  CreateStoreMemberFormComponent,
} from 'apps/bms-bo/src/components';
import {
  BmsBranchStore,
  BranchMemberStore,
  BranchStore,
} from 'apps/bms-bo/src/state';
import { explicitEffect } from 'ngxtension/explicit-effect';

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
  readonly client = injectMixClient();

  public modal = injectModalService();
  public toast = injectToastService();
  public queryParams = injectQueryParams();

  public store = inject(BranchMemberStore);
  public bmsStore = inject(BmsBranchStore);
  public translateSrv = inject(TranslocoService);
  public dialog = inject(DialogService);
  public vcr = inject(ViewContainerRef);
  public router = inject(Router);

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

    explicitEffect([this.branch, this.queryParams], ([branch, params]) => {
      if (branch?.id)
        this.store
          .search(
            new MixQuery()
              .default(100)
              .equal('storeId', branch?.id)
              .sort('id', ESortDirection.Desc)
              .withParams(params),
          )
          .subscribe();
    });
  }

  readonly contextMenu: GridContextMenu<IBranchMember>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.onDelete(item.id),
      iconClass: 'text-error',
    },
  ];

  public onDelete(id: number) {
    this.modal.asKForAction(
      this.translate('common.delete.confirmation'),
      () => {
        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translate('common.delete.processing'),
        );

        this.store
          .deleteDataById(id, {
            success: () => {
              toastSuccess(this.translate('common.delete.success'));
            },
            error: (error) => {
              toastError(this.translate('common.delete.error'));
            },
          })
          .subscribe();
      },
    );
  }

  public addMember(addMany: boolean = false) {
    if (addMany) {
      this.dialog.open(BulkCreateStoreMemberComponent, {
        data: {
          storeId: this.branch()?.id,
          current: this.store.dataEntities(),
        },
        vcr: this.vcr,
        windowClass: 'fullscreen-dialog',
      });
    } else {
      this.dialog.open(CreateStoreMemberFormComponent, {
        data: { storeId: this.branch()?.id },
        vcr: this.vcr,
      });
    }
  }

  public editMember(item: IBranchMember) {
    if (this.isLoading()) return;

    this.loadingState.set(LoadingState.Loading);
    const { success: toastSuccess } = this.toast.loading('Processing member');
    this.client.auth
      .getUserByUsername(item.username, {
        success: (user) => {
          toastSuccess('Successfully extracting user info');
          this.router.navigate(['app', 'iam', 'user', user.id]);
        },
        error: (err) => {
          this.loadingState.set(LoadingState.Pending);
          this.toast.error('Error fetching user info');
        },
      })
      .then();
  }
}
