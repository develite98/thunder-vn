import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { injectParams } from '@mixcore/router';
import { MixDeleteComponent } from '@mixcore/ui/delete';
import { IFormConfig, MixFormComponent } from '@mixcore/ui/forms';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectModalService } from '@mixcore/ui/modal';
import { MixTileComponent } from '@mixcore/ui/tile';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { userDetailPage, UserStore } from 'apps/iam/src/state';

@Component({
  selector: 'mix-iam-user-config-page',
  templateUrl: './user-config.page.html',
  imports: [
    MixFormComponent,
    MixDeleteComponent,
    MixTileComponent,
    MixIconComponent,
    DatePipe,
    TranslocoPipe,
  ],
})
export class IamUserConfigPageComponent {
  readonly modal = injectModalService();
  readonly useId = injectParams('userId');
  readonly store = inject(UserStore);
  readonly event = injectDispatch(userDetailPage);
  readonly router = injectMiniAppRouter();
  readonly toast = injectToastService();

  public user = this.store.selectEntityById(this.useId);

  public form = new FormGroup({});
  public fields: IFormConfig[] = [
    {
      key: 'id',
      type: 'input',
      props: {
        label: 'common.label.id',
        placeholder: 'common.input.placeholder',
        description: '',
        required: true,
        readonly: true, // Email is read-only
      },
    },
    {
      key: 'userName',
      type: 'input',
      props: {
        label: 'common.label.username',
        placeholder: 'common.input.placeholder',
        description: '',
        required: true,
        readonly: true, // Email is read-only
      },
    },
    {
      key: 'email',
      type: 'input',
      props: {
        label: 'common.label.email',
        placeholder: 'common.input.placeholder',
        description: '',
        type: 'email',
        required: true,
        readonly: true, // Email is read-only
      },
    },
  ];

  public onDelete() {
    this.modal.asKForAction('Are you sure to remove this data', () => {
      const userId = this.useId();
      if (!userId) return;

      const { success: toastSuccess, error: toastError } = this.toast.loading(
        'Trying to delete user...',
      );

      this.event.deleted({
        data: userId,
        callback: {
          success: () => {
            toastSuccess('User deleted successfully');
            this.router.navigate(['users']);
          },
          error: (error) => {
            toastError('Error deleting user');
            console.error('Error deleting user:', error);
          },
        },
      });
    });
  }
}
